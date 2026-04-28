"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send, MessageSquare, Shield, User, CheckCircle, CreditCard, Sparkles,
  Plus, Trash2, Brain, Lock, Mail, Phone, Calendar, IdCard, Building2,
  ArrowRight, Pencil, Paperclip, FileText, Image as ImageIcon, X,
  Upload, Heart, Globe, Loader2, Database,
  ThumbsUp, ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createConversation, deleteConversation, renameConversation } from "@/lib/actions";

interface Conversation { id: string; title: string; updated_at: string; }
interface InitialMessage { id: string; role: "user" | "assistant" | "system"; content: string; created_at: string; }
interface ExtractedRecord { type: "personal" | "financial"; category: "A" | "B" | "C"; score: number; display: Record<string, unknown>; timestamp: number; }
interface PendingFile { file: File; preview: string | null; type: "image" | "pdf"; }
interface ChatUIProps { conversationId: string; conversationTitle?: string; conversations: Conversation[]; initialMessages: InitialMessage[]; }

const PDF_MARKER_START = "<<PDF_CONTEXT>>";
const PDF_MARKER_END = "<</PDF_CONTEXT>>";

async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Strips the hidden PDF context block from a user message so the UI shows
 * a clean "📄 file.pdf" placeholder instead of dumping all the extracted text.
 */
function extractDisplayText(raw: string): { text: string; pdfFileName: string | null } {
  const start = raw.indexOf(PDF_MARKER_START);
  const end = raw.indexOf(PDF_MARKER_END);
  if (start === -1 || end === -1) return { text: raw, pdfFileName: null };
  const before = raw.slice(0, start).trim();
  const block = raw.slice(start + PDF_MARKER_START.length, end);
  const fileMatch = block.match(/__filename:(.+?)__/);
  const fileName = fileMatch ? fileMatch[1].trim() : "ملف PDF";
  return { text: before, pdfFileName: fileName };
}

function ClassificationResult({ out }: { out: { ok?: boolean; type?: string; category?: string; score?: number; display?: Record<string, string | number> } }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const catBg: Record<string, string> = { A: "bg-red-50", B: "bg-amber-50", C: "bg-green-50" };
  const catText: Record<string, string> = { A: "text-red-600", B: "text-amber-600", C: "text-green-600" };
  const catDot: Record<string, string> = { A: "bg-red-500", B: "bg-amber-500", C: "bg-green-500" };
  const fieldLabels: Record<string, string> = { name: "الاسم", email: "البريد", phone: "الجوال", birth_date: "تاريخ الميلاد", bank_name: "البنك", owner_name: "صاحب الحساب", account_masked: "الحساب", balance: "الرصيد" };

  const fields = out.display ? Object.entries(out.display).filter(([, v]) => v).map(([k]) => fieldLabels[k] || k) : [];
  const cat = out.category || "C";
  const typeLabel = out.type === "personal" ? "بيانات شخصية" : "بيانات مالية";

  if (!done) {
    return (
      <div className="bg-white border border-brand-muted/40 rounded-2xl px-3 py-2.5 flex items-center gap-2.5 animate-fade-in">
        <Loader2 className="h-4 w-4 text-brand animate-spin shrink-0" />
        <span className="text-xs text-muted-foreground">جاري الحفظ والتصنيف...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-green-200 rounded-2xl overflow-hidden animate-slide-up">
      <div className="px-3 py-2.5 flex items-center gap-2.5 border-b border-border/60">
        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle className="h-4 w-4 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold leading-tight">تم حفظ {typeLabel}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{fields.length} حقل · تم التشفير</p>
        </div>
        <div className={`flex items-center gap-1.5 ${catBg[cat]} ${catText[cat]} px-2 py-1 rounded-full text-[10px] font-bold shrink-0`}>
          <span className={`w-1.5 h-1.5 rounded-full ${catDot[cat]}`} />
          فئة {cat}
        </div>
      </div>
      {fields.length > 0 && (
        <div className="px-3 py-2 flex flex-wrap gap-1 bg-surface/50">
          {fields.map((f) => (
            <span key={f} className="text-[10px] bg-white text-muted-foreground px-2 py-0.5 rounded-md border border-border">
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const quickOptions = [
  { label: "بيانات شخصية", icon: User, text: "أريد إدخال بيانات شخصية" },
  { label: "بيانات مالية", icon: CreditCard, text: "أريد إدخال بيانات مالية" },
  { label: "بيانات صحية", icon: Heart, text: "أريد إدخال بيانات صحية" },
  { label: "بيانات عامة", icon: Globe, text: "أريد إدخال بيانات عامة" },
];

/**
 * Heuristic: detect if the assistant's last message asks for a yes/no
 * confirmation about classifying / saving data, so we can show quick action buttons.
 */
function isClassifyConfirmation(text: string): boolean {
  const lower = text.toLowerCase();
  return /هل تريد (تصنيف|حفظ|تخزين|تسجيل)|هل أحفظ|هل أقوم|أ?حفظ هذه/i.test(text) ||
         /shall i (classify|save|store)/i.test(lower);
}

export function ChatUI({ conversationId, conversationTitle = "محادثة جديدة", conversations, initialMessages }: ChatUIProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [extracted, setExtracted] = useState<ExtractedRecord[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(conversationTitle);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(conversationTitle);
  const titleRenamed = useRef(conversationTitle !== "محادثة جديدة");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragCounter = useRef(0);

  const autoRenameConv = useCallback(async (userMsg: string) => {
    if (titleRenamed.current) return;
    titleRenamed.current = true;
    try {
      const res = await fetch("/api/chat/title", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: userMsg }) });
      const { title: t } = await res.json();
      if (t && t !== "محادثة جديدة") { setTitle(t); setTitleDraft(t); await renameConversation(conversationId, t); router.refresh(); }
    } catch { /* silent */ }
  }, [conversationId, router]);

  function handleTitleSave() {
    const t = titleDraft.trim();
    if (t && t !== title) { setTitle(t); startTransition(async () => { await renameConversation(conversationId, t); router.refresh(); }); }
    setEditingTitle(false);
  }

  useEffect(() => { document.cookie = `sirar_active_conv=${conversationId};path=/;max-age=${60 * 60 * 24 * 30};samesite=lax`; }, [conversationId]);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat", body: { conversationId } }),
    messages: initialMessages.map((m) => ({ id: m.id, role: m.role as "user" | "assistant", parts: [{ type: "text" as const, text: m.content }] })),
    onFinish: ({ message }) => {
      const toolParts = message.parts?.filter((p: { type: string }) => p.type.startsWith("tool-") || p.type === "tool-result");
      toolParts?.forEach((part: { type: string; output?: { ok: boolean; saved: boolean; type: string; category: string; score: number; display: Record<string, unknown> } }) => {
        const out = part.output;
        if (out?.ok && out.saved) {
          setExtracted((prev) => [...prev, { type: out.type as "personal" | "financial", category: out.category as "A" | "B" | "C", score: out.score, display: out.display, timestamp: Date.now() }]);
          router.refresh();
        }
      });
      const userMsgs = messages.filter((m) => m.role === "user");
      if (userMsgs.length === 1) {
        const firstText = (userMsgs[0].parts || []).filter((p: { type: string }): p is { type: "text"; text: string } => p.type === "text").map((p) => p.text).join("");
        const cleanText = extractDisplayText(firstText).text || "محادثة جديدة";
        if (cleanText) autoRenameConv(cleanText);
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function acceptFile(file: File) {
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) return;
    if (file.size > 10 * 1024 * 1024) { alert("حجم الملف يجب أن يكون أقل من 10 ميغابايت"); return; }
    const preview = isImage ? URL.createObjectURL(file) : null;
    setPendingFile({ file, preview, type: isImage ? "image" : "pdf" });
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDragEnter(e: React.DragEvent) { e.preventDefault(); e.stopPropagation(); dragCounter.current++; setDragging(true); }
  function handleDragLeave(e: React.DragEvent) { e.preventDefault(); e.stopPropagation(); dragCounter.current--; if (dragCounter.current === 0) setDragging(false); }
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); e.stopPropagation(); }
  function handleDrop(e: React.DragEvent) { e.preventDefault(); e.stopPropagation(); setDragging(false); dragCounter.current = 0; const file = e.dataTransfer.files?.[0]; if (file) acceptFile(file); }
  function removePendingFile() { if (pendingFile?.preview) URL.revokeObjectURL(pendingFile.preview); setPendingFile(null); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading || uploadingFile) return;

    if (pendingFile) {
      setUploadingFile(true);
      try {
        if (pendingFile.type === "image") {
          const dataUrl = await fileToDataURL(pendingFile.file);
          const textContent = input.trim() || "أرجو تحليل هذه الصورة واستخراج البيانات منها";
          sendMessage({
            role: "user",
            parts: [
              { type: "text", text: textContent },
              { type: "file", mediaType: pendingFile.file.type, url: dataUrl },
            ],
          });
          setInput(""); removePendingFile(); setUploadingFile(false);
          return;
        } else {
          const formData = new FormData();
          formData.append("file", pendingFile.file);
          const res = await fetch("/api/chat/parse-pdf", { method: "POST", body: formData });
          const data = await res.json();
          if (data.error) { alert("فشل في قراءة الملف: " + data.error); setUploadingFile(false); return; }
          // Wrap PDF content in marker so the UI can hide it visually
          // while the API still receives the full text for analysis.
          const userPrefix = input.trim() || "حلّل هذا الملف واستخرج البيانات منه";
          const wrapped = `${userPrefix}\n${PDF_MARKER_START}__filename:${pendingFile.file.name}__\n${data.text}\n${PDF_MARKER_END}`;
          sendMessage({ text: wrapped });
          setInput(""); removePendingFile();
        }
      } catch { alert("حدث خطأ أثناء معالجة الملف"); }
      setUploadingFile(false);
      return;
    }

    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  }

  function handleNewConversation() { startTransition(async () => { const res = await createConversation(); if (res?.id) router.push(`/app/chat/${res.id}`); }); }
  function handleDeleteConv(id: string, e: React.MouseEvent) { e.preventDefault(); e.stopPropagation(); if (!confirm("حذف هذه المحادثة؟")) return; startTransition(async () => { await deleteConversation(id); if (id === conversationId) router.push("/app/chat"); }); }

  const personalRecord = extracted.find((e) => e.type === "personal");
  const financialRecord = extracted.find((e) => e.type === "financial");
  const hasData = extracted.length > 0;
  const hasHighRisk = extracted.some((e) => e.category === "A");
  const loadingText = uploadingFile ? "جاري رفع الملف وتحليله..." : status === "streaming" ? "سرار يكتب الرد..." : "جاري معالجة طلبك...";

  // Detect if assistant's last message asks for confirmation
  const lastMsg = messages[messages.length - 1];
  const lastIsAssistant = lastMsg?.role === "assistant";
  const lastText = lastIsAssistant ? (lastMsg.parts || []).filter((p: { type: string }): p is { type: "text"; text: string } => p.type === "text").map((p) => p.text).join("") : "";
  const showConfirmButtons = lastIsAssistant && !isLoading && isClassifyConfirmation(lastText) &&
    !(lastMsg.parts || []).some((p: { type: string }) => p.type.startsWith("tool-"));

  return (
    <div className="h-full flex overflow-hidden bg-surface relative" onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
      {dragging && (
        <div className="absolute inset-0 z-50 bg-brand/10 backdrop-blur-sm border-2 border-dashed border-brand rounded-2xl flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center"><Upload className="h-10 w-10 text-brand mx-auto mb-3" /><p className="font-bold text-sm">اسحب الملف هنا</p><p className="text-xs text-muted-foreground mt-1">PDF أو صورة (حتى 10 ميغابايت)</p></div>
        </div>
      )}

      {/* Sidebar */}
      <div className="hidden md:flex w-56 bg-white border-s border-border flex-col shrink-0">
        <div className="p-3 border-b border-border shrink-0"><Button onClick={handleNewConversation} disabled={pending} className="w-full bg-brand hover:bg-brand-hover rounded-xl gap-2 text-sm h-9"><Plus className="h-4 w-4" />محادثة جديدة</Button></div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase px-2 py-1">المحادثات السابقة</p>
          {conversations.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">لا توجد محادثات سابقة</p>}
          {conversations.map((conv) => {
            const isActive = conv.id === conversationId;
            return (<Link key={conv.id} href={`/app/chat/${conv.id}`} className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-colors group ${isActive ? "bg-brand-light text-brand font-medium" : "text-muted-foreground hover:bg-surface hover:text-foreground"}`}><MessageSquare className="h-3.5 w-3.5 shrink-0" /><span className="flex-1 truncate">{isActive ? title : conv.title}</span><button onClick={(e) => handleDeleteConv(conv.id, e)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"><Trash2 className="h-3 w-3" /></button></Link>);
          })}
        </div>
      </div>

      {/* Chat Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <div className="bg-white border-b border-border px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link href="/app/data" className="text-muted-foreground hover:text-brand text-xs flex items-center gap-1 shrink-0 transition-colors"><ArrowRight className="h-3.5 w-3.5" />البيانات</Link>
            <span className="text-muted-foreground/30 text-xs">/</span>
            <div className="flex items-center gap-1.5 min-w-0">
              <MessageSquare className="h-3.5 w-3.5 text-brand shrink-0" />
              {editingTitle ? (
                <input autoFocus className="text-sm font-medium border border-brand rounded-lg px-2 py-0.5 bg-surface outline-none w-48" value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} onBlur={handleTitleSave} onKeyDown={(e) => { if (e.key === "Enter") handleTitleSave(); if (e.key === "Escape") { setTitleDraft(title); setEditingTitle(false); } }} />
              ) : (
                <button onClick={() => setEditingTitle(true)} className="text-sm font-medium truncate flex items-center gap-1 hover:text-brand transition-colors group"><span className="truncate">{title}</span><Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /></button>
              )}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />محفوظ تلقائياً</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 lg:p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0"><Shield className="h-4 w-4 text-white" /></div>
                <div className="bg-white rounded-2xl rounded-tr-md p-4 shadow-sm border border-border max-w-md">
                  <p className="text-sm leading-relaxed">مرحباً 👋<br />أنا سرار، مساعدك لإدارة وحماية بياناتك.<br />اختر نوع البيانات أو اسحب ملفاً لتحليله:</p>
                  <div className="grid grid-cols-2 gap-1.5 mt-3">
                    {quickOptions.map((q) => (<button key={q.label} onClick={() => sendMessage({ text: q.text })} disabled={isLoading} className="flex items-center gap-1.5 text-[11px] bg-surface hover:bg-brand-light hover:text-brand px-3 py-2 rounded-xl transition-colors border border-border text-start"><q.icon className="h-3.5 w-3.5 shrink-0" />{q.label}</button>))}
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="flex items-center gap-1.5 text-[11px] text-brand hover:text-brand-hover mt-2 w-full justify-center py-1.5 border border-dashed border-brand/30 rounded-xl hover:bg-brand-light/50 transition-colors"><Paperclip className="h-3.5 w-3.5" />إرفاق ملف PDF أو صورة</button>
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const textParts = (msg.parts || []).filter((p: { type: string }): p is { type: "text"; text: string } => p.type === "text");
              const rawText = textParts.map((p) => p.text).join("");
              const { text: displayText, pdfFileName } = msg.role === "user"
                ? extractDisplayText(rawText)
                : { text: rawText, pdfFileName: null };
              const fileParts = (msg.parts || []).filter((p: { type: string }): p is { type: "file"; mediaType: string; url: string } => p.type === "file");
              const toolParts = (msg.parts || []).filter((p: { type: string }) => p.type.startsWith("tool-") && !p.type.includes("tool-input"));
              if (!displayText && !pdfFileName && toolParts.length === 0 && fileParts.length === 0) return null;

              return (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-gray-200" : "bg-brand"}`}>
                    {msg.role === "user" ? <User className="h-4 w-4 text-gray-600" /> : <Shield className="h-4 w-4 text-white" />}
                  </div>
                  <div className="space-y-2 max-w-md min-w-0">
                    {/* Image attachments */}
                    {fileParts.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {fileParts.map((fp, i) => fp.mediaType?.startsWith("image/") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={fp.url} alt="" className="w-32 h-32 rounded-xl object-cover border border-border" />
                        ) : (
                          <div key={i} className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs border border-red-200"><FileText className="h-4 w-4" />ملف PDF</div>
                        ))}
                      </div>
                    )}
                    {/* PDF placeholder (instead of dumping full text) */}
                    {pdfFileName && (
                      <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-xl text-xs border border-red-200">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium truncate max-w-[200px]">{pdfFileName}</span>
                      </div>
                    )}
                    {/* Text bubble */}
                    {displayText && (
                      <div className={`rounded-2xl p-4 shadow-sm border text-sm ${msg.role === "user" ? "bg-brand-light rounded-tl-md border-brand-muted/30" : "bg-white rounded-tr-md border-border"}`}>
                        {msg.role === "user" ? (
                          <p className="leading-relaxed whitespace-pre-wrap break-words">{displayText}</p>
                        ) : (
                          <div className="leading-relaxed break-words space-y-1.5">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                                strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                ul: ({ children }) => <ul className="list-disc ms-4 space-y-1 my-2">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ms-4 space-y-1 my-2">{children}</ol>,
                                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                code: ({ children }) => <code className="bg-surface px-1.5 py-0.5 rounded text-xs font-mono" dir="ltr">{children}</code>,
                                a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="text-brand underline">{children}</a>,
                                h1: ({ children }) => <h1 className="text-base font-bold mt-2 mb-1">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-sm font-bold mt-2 mb-1">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-bold mt-1.5 mb-0.5">{children}</h3>,
                                blockquote: ({ children }) => <blockquote className="border-s-2 border-brand/30 ps-2 italic text-muted-foreground">{children}</blockquote>,
                              }}
                            >
                              {displayText}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}
                    {toolParts.map((tp, i) => {
                      const tpAny = tp as { type: string; output?: { ok?: boolean; type?: string; category?: string; score?: number; display?: Record<string, string | number> } };
                      if (!tpAny.output?.ok) return null;
                      return <ClassificationResult key={i} out={tpAny.output} />;
                    })}
                  </div>
                </div>
              );
            })}

            {/* Confirm classification quick actions */}
            {showConfirmButtons && (
              <div className="flex gap-2 ms-11 animate-fade-in">
                <button
                  onClick={() => sendMessage({ text: "نعم، صنّف واحفظ البيانات" })}
                  className="flex items-center gap-1.5 bg-brand hover:bg-brand-hover text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  نعم، صنّف واحفظ
                </button>
                <button
                  onClick={() => sendMessage({ text: "لا، تجاهل" })}
                  className="flex items-center gap-1.5 bg-white hover:bg-surface text-muted-foreground text-xs font-medium px-4 py-2 rounded-xl transition-colors border border-border"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  لا
                </button>
              </div>
            )}

            {(isLoading || uploadingFile) && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                  {uploadingFile ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : status === "streaming" ? <Brain className="h-4 w-4 text-white animate-pulse" /> : <Sparkles className="h-4 w-4 text-white animate-pulse" />}
                </div>
                <div className="bg-white rounded-2xl rounded-tr-md px-4 py-3 shadow-sm border border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-brand/50 animate-bounce" /><div className="w-2 h-2 rounded-full bg-brand/50 animate-bounce [animation-delay:150ms]" /><div className="w-2 h-2 rounded-full bg-brand/50 animate-bounce [animation-delay:300ms]" /></div>
                    <span className="text-xs text-muted-foreground">{loadingText}</span>
                  </div>
                  {uploadingFile && <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-brand rounded-full animate-loading-bar" /></div>}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* File preview */}
        {pendingFile && (
          <div className="px-4 pb-1 shrink-0"><div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2 text-sm animate-slide-up">
              {pendingFile.type === "image" ? (<>{/* eslint-disable-next-line @next/next/no-img-element */}{pendingFile.preview && <img src={pendingFile.preview} alt="" className="w-10 h-10 rounded-lg object-cover" />}<ImageIcon className="h-4 w-4 text-blue-500" /></>) : (<FileText className="h-4 w-4 text-red-500" />)}
              <span className="text-xs truncate max-w-[200px]">{pendingFile.file.name}</span>
              <span className="text-[10px] text-muted-foreground">({(pendingFile.file.size / 1024).toFixed(0)} KB)</span>
              <button onClick={removePendingFile} className="p-0.5 hover:bg-red-50 rounded transition-colors"><X className="h-3.5 w-3.5 text-red-400" /></button>
            </div>
          </div></div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-border shrink-0">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2 items-center">
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />
            <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading || uploadingFile} className="shrink-0 h-10 w-10 rounded-xl hover:bg-brand-light hover:text-brand" title="إرفاق ملف"><Paperclip className="h-5 w-5" /></Button>
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={pendingFile ? "أضف رسالة مع الملف (اختياري)..." : "اكتب رسالتك هنا..."} className="flex-1 rounded-xl bg-surface border-0 h-10" disabled={isLoading || uploadingFile} />
            <Button type="submit" size="icon" className="bg-brand hover:bg-brand-hover rounded-xl h-10 w-10 shrink-0" disabled={(isLoading || uploadingFile) || (!input.trim() && !pendingFile)}>
              {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex w-72 bg-white border-s border-border flex-col shrink-0">
        <div className="p-4 border-b border-border shrink-0"><div className="flex items-center gap-2"><Shield className="h-4 w-4 text-brand" /><h3 className="font-bold text-sm">ملخص البيانات</h3></div></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!hasData ? (
            <div className="text-center py-8"><div className="w-12 h-12 mx-auto mb-3 bg-surface rounded-2xl flex items-center justify-center"><Database className="h-6 w-6 text-muted-foreground/30" /></div><p className="text-sm font-medium text-muted-foreground">لم يتم إدخال بيانات بعد</p><p className="text-xs text-muted-foreground/60 mt-1">ستظهر هنا تلقائياً</p></div>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm"><CheckCircle className="h-4 w-4" /><span>تم إدخال البيانات بنجاح</span></div>
              {personalRecord && (
                <div>
                  <div className="flex items-center gap-2 mb-3"><User className="h-4 w-4 text-muted-foreground" /><h4 className="font-semibold text-sm">البيانات الشخصية</h4></div>
                  <div className="space-y-2.5 text-sm">
                    {personalRecord.display.name as string && <SummaryRow label="الاسم" value={personalRecord.display.name as string} />}
                    {personalRecord.display.email as string && <SummaryRow icon={Mail} label="البريد" value={personalRecord.display.email as string} ltr />}
                    {personalRecord.display.phone as string && <SummaryRow icon={Phone} label="الجوال" value={personalRecord.display.phone as string} ltr />}
                    {personalRecord.display.birth_date as string && <SummaryRow icon={Calendar} label="تاريخ الميلاد" value={personalRecord.display.birth_date as string} />}
                    {personalRecord.display.national_id as string && <SummaryRow icon={IdCard} label="الهوية" value={`****${(personalRecord.display.national_id as string).slice(-2)}`} ltr />}
                  </div>
                  <Badge className="mt-3 bg-green-50 text-green-700 border-green-200 text-[10px]">فئة {personalRecord.category}</Badge>
                </div>
              )}
              {financialRecord && (
                <div>
                  <div className="flex items-center gap-2 mb-3"><CreditCard className="h-4 w-4 text-muted-foreground" /><h4 className="font-semibold text-sm">البيانات المالية</h4></div>
                  <div className="space-y-2.5 text-sm">
                    {financialRecord.display.bank_name as string && <SummaryRow icon={Building2} label="البنك" value={financialRecord.display.bank_name as string} />}
                    {financialRecord.display.account_masked as string && <SummaryRow label="الحساب" value={financialRecord.display.account_masked as string} ltr />}
                    {(financialRecord.display.balance as number) !== undefined && <SummaryRow label="الرصيد" value={`${(financialRecord.display.balance as number).toLocaleString()} SAR`} ltr />}
                  </div>
                  <Badge className="mt-3 bg-red-50 text-red-700 border-red-200 text-[10px]">فئة A</Badge>
                </div>
              )}
              <div className={`rounded-xl p-3 ${hasHighRisk ? "bg-red-50" : "bg-surface"}`}>
                <div className="flex items-center gap-2 mb-1"><Lock className={`h-4 w-4 ${hasHighRisk ? "text-red-500" : "text-brand"}`} /><span className="font-semibold text-sm">مستوى الحماية</span><Badge className={`ms-auto text-[10px] ${hasHighRisk ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>{hasHighRisk ? "عالي جداً" : "متوسط"}</Badge></div>
                <p className="text-xs text-muted-foreground">{hasHighRisk ? "تشفير AES-256 + إخفاء كامل" : "تشفير في النقل + تسجيل الوصول"}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, ltr = false, icon: Icon }: { label: string; value: string; ltr?: boolean; icon?: typeof User }) {
  return (<div className="flex justify-between items-center"><span className="text-muted-foreground text-xs flex items-center gap-1.5">{Icon && <Icon className="h-3 w-3" />}{label}</span><span className="font-medium text-xs truncate max-w-[60%]" dir={ltr ? "ltr" : undefined}>{value}</span></div>);
}
