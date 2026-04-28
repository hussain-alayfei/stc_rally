"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  MessageSquare,
  Shield,
  User,
  CheckCircle,
  CreditCard,
  Sparkles,
  Plus,
  Trash2,
  Brain,
  Lock,
  Mail,
  Phone,
  Calendar,
  IdCard,
  Building2,
  ArrowRight,
  Database,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  createConversation,
  deleteConversation,
  renameConversation,
} from "@/lib/actions";

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

interface InitialMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

interface ExtractedRecord {
  type: "personal" | "financial";
  category: "A" | "B" | "C";
  score: number;
  display: Record<string, unknown>;
  timestamp: number;
}

interface ChatUIProps {
  conversationId: string;
  conversationTitle?: string;
  conversations: Conversation[];
  initialMessages: InitialMessage[];
}

export function ChatUI({
  conversationId,
  conversationTitle = "محادثة جديدة",
  conversations,
  initialMessages,
}: ChatUIProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [extracted, setExtracted] = useState<ExtractedRecord[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(conversationTitle);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(conversationTitle);
  const titleRenamed = useRef(conversationTitle !== "محادثة جديدة");

  const autoRenameConv = useCallback(async (userMsg: string) => {
    if (titleRenamed.current) return;
    titleRenamed.current = true;
    try {
      const res = await fetch("/api/chat/title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const { title: t } = await res.json();
      if (t && t !== "محادثة جديدة") {
        setTitle(t);
        setTitleDraft(t);
        await renameConversation(conversationId, t);
        router.refresh();
      }
    } catch { /* silent */ }
  }, [conversationId, router]);

  function handleTitleSave() {
    const t = titleDraft.trim();
    if (t && t !== title) {
      setTitle(t);
      startTransition(async () => {
        await renameConversation(conversationId, t);
        router.refresh();
      });
    }
    setEditingTitle(false);
  }

  useEffect(() => {
    document.cookie = `sirar_active_conv=${conversationId};path=/;max-age=${60 * 60 * 24 * 30};samesite=lax`;
  }, [conversationId]);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { conversationId },
    }),
    messages: initialMessages.map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      parts: [{ type: "text" as const, text: m.content }],
    })),
    onFinish: ({ message }) => {
      const toolParts = message.parts?.filter(
        (p: { type: string }) =>
          p.type.startsWith("tool-") || p.type === "tool-result"
      );
      toolParts?.forEach(
        (part: {
          type: string;
          output?: { ok: boolean; saved: boolean; type: string; category: string; score: number; display: Record<string, unknown> };
        }) => {
          const out = part.output;
          if (out?.ok && out.saved) {
            setExtracted((prev) => [
              ...prev,
              {
                type: out.type as "personal" | "financial",
                category: out.category as "A" | "B" | "C",
                score: out.score,
                display: out.display,
                timestamp: Date.now(),
              },
            ]);
            router.refresh();
          }
        }
      );

      const userMsgs = messages.filter((m) => m.role === "user");
      if (userMsgs.length === 1) {
        const firstText = (userMsgs[0].parts || [])
          .filter((p: { type: string }): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("");
        if (firstText) autoRenameConv(firstText);
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  function handleNewConversation() {
    startTransition(async () => {
      const res = await createConversation();
      if (res?.id) router.push(`/app/chat/${res.id}`);
    });
  }

  function handleDeleteConv(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("حذف هذه المحادثة؟")) return;
    startTransition(async () => {
      await deleteConversation(id);
      if (id === conversationId) {
        router.push("/app/chat");
      }
    });
  }

  const personalRecord = extracted.find((e) => e.type === "personal");
  const financialRecord = extracted.find((e) => e.type === "financial");
  const hasData = extracted.length > 0;
  const hasHighRisk = extracted.some((e) => e.category === "A");

  return (
    <div className="h-full flex overflow-hidden bg-surface">
      {/* Conversation Sidebar */}
      <div className="hidden md:flex w-56 bg-white border-s border-border flex-col shrink-0">
        <div className="p-3 border-b border-border shrink-0">
          <Button
            onClick={handleNewConversation}
            disabled={pending}
            className="w-full bg-brand hover:bg-brand-hover rounded-xl gap-2 text-sm h-9"
          >
            <Plus className="h-4 w-4" />
            محادثة جديدة
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase px-2 py-1">
            المحادثات السابقة
          </p>
          {conversations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              لا توجد محادثات سابقة
            </p>
          )}
          {conversations.map((conv) => {
            const isActive = conv.id === conversationId;
            return (
              <Link
                key={conv.id}
                href={`/app/chat/${conv.id}`}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs transition-colors group ${
                  isActive
                    ? "bg-brand-light text-brand font-medium"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 truncate">{isActive ? title : conv.title}</span>
                <button
                  onClick={(e) => handleDeleteConv(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Center: Chat Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Chat Header */}
        <div className="bg-white border-b border-border px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Link
              href="/app/data"
              className="text-muted-foreground hover:text-brand text-xs flex items-center gap-1 shrink-0 transition-colors"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              البيانات
            </Link>
            <span className="text-muted-foreground/30 text-xs">/</span>
            <div className="flex items-center gap-1.5 min-w-0">
              <MessageSquare className="h-3.5 w-3.5 text-brand shrink-0" />
              {editingTitle ? (
                <input
                  autoFocus
                  className="text-sm font-medium border border-brand rounded-lg px-2 py-0.5 bg-surface outline-none w-48"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleSave();
                    if (e.key === "Escape") { setTitleDraft(title); setEditingTitle(false); }
                  }}
                />
              ) : (
                <button
                  onClick={() => setEditingTitle(true)}
                  className="text-sm font-medium truncate flex items-center gap-1 hover:text-brand transition-colors group"
                >
                  <span className="truncate">{title}</span>
                  <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            محفوظ تلقائياً
          </div>
        </div>

        {/* Messages — this is the only scrollable part */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0 p-4 lg:p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tr-md p-4 shadow-sm border border-border max-w-md">
                  <p className="text-sm leading-relaxed">
                    مرحباً 👋<br />
                    أنا سرار، مساعدك لإدارة وحماية بياناتك.<br />
                    لنبدأ، ما نوع البيانات التي ترغب في إدخالها؟
                  </p>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {["بيانات شخصية", "بيانات مالية", "بيانات صحية"].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage({ text: `أريد إدخال ${q}` })}
                        disabled={isLoading}
                        className="text-[11px] bg-surface hover:bg-brand-light hover:text-brand px-2.5 py-1 rounded-full transition-colors border border-border"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const text = (msg.parts || [])
                .filter((p: { type: string; text?: string }): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text)
                .join("");

              const toolParts = (msg.parts || []).filter(
                (p: { type: string }) => p.type.startsWith("tool-") && !p.type.includes("tool-input")
              );

              if (!text && toolParts.length === 0) return null;

              return (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-gray-200" : "bg-brand"}`}>
                    {msg.role === "user" ? <User className="h-4 w-4 text-gray-600" /> : <Shield className="h-4 w-4 text-white" />}
                  </div>
                  <div className="space-y-2 max-w-md min-w-0">
                    {text && (
                      <div className={`rounded-2xl p-4 shadow-sm border text-sm ${msg.role === "user" ? "bg-brand-light rounded-tl-md border-brand-muted/30" : "bg-white rounded-tr-md border-border"}`}>
                        <p className="leading-relaxed whitespace-pre-wrap break-words">{text}</p>
                      </div>
                    )}
                    {toolParts.map((tp, i) => {
                      const tpAny = tp as { type: string; output?: { ok?: boolean; type?: string; category?: string; display?: Record<string, string | number> } };
                      const out = tpAny.output;
                      if (!out?.ok) return null;
                      return (
                        <div key={i} className="bg-gradient-to-br from-green-50 to-brand-light border border-green-200 rounded-2xl p-3 text-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-bold text-xs">
                              تم حفظ {out.type === "personal" ? "البيانات الشخصية" : "البيانات المالية"}
                            </span>
                            <Badge className={`ms-auto text-[10px] border-0 ${out.category === "A" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                              فئة {out.category}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-muted-foreground">تم تطبيق التشفير وتحديد صلاحيات الوصول تلقائياً</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                  <Brain className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div className="bg-white rounded-2xl rounded-tr-md p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-brand/40 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-brand/40 animate-bounce [animation-delay:150ms]" />
                      <div className="w-2 h-2 rounded-full bg-brand/40 animate-bounce [animation-delay:300ms]" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">جاري التحليل...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar — pinned to bottom */}
        <div className="p-3 bg-white border-t border-border shrink-0">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 rounded-xl bg-surface border-0 h-10"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" className="bg-brand hover:bg-brand-hover rounded-xl h-10 w-10 shrink-0" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right Panel — Data Summary */}
      <div className="hidden lg:flex w-72 bg-white border-s border-border flex-col shrink-0">
        <div className="p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand" />
            <h3 className="font-bold text-sm">ملخص البيانات</h3>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!hasData ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 bg-surface rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">لم يتم إدخال بيانات بعد</p>
              <p className="text-xs text-muted-foreground/60 mt-1">ستظهر هنا تلقائياً</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>تم إدخال البيانات بنجاح</span>
              </div>
              {personalRecord && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">البيانات الشخصية</h4>
                  </div>
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
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">البيانات المالية</h4>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    {financialRecord.display.bank_name as string && <SummaryRow icon={Building2} label="البنك" value={financialRecord.display.bank_name as string} />}
                    {financialRecord.display.account_masked as string && <SummaryRow label="الحساب" value={financialRecord.display.account_masked as string} ltr />}
                    {(financialRecord.display.balance as number) !== undefined && <SummaryRow label="الرصيد" value={`${(financialRecord.display.balance as number).toLocaleString()} SAR`} ltr />}
                  </div>
                  <Badge className="mt-3 bg-red-50 text-red-700 border-red-200 text-[10px]">فئة A</Badge>
                </div>
              )}
              <div className={`rounded-xl p-3 ${hasHighRisk ? "bg-red-50" : "bg-surface"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Lock className={`h-4 w-4 ${hasHighRisk ? "text-red-500" : "text-brand"}`} />
                  <span className="font-semibold text-sm">مستوى الحماية</span>
                  <Badge className={`ms-auto text-[10px] ${hasHighRisk ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                    {hasHighRisk ? "عالي جداً" : "متوسط"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {hasHighRisk ? "تشفير AES-256 + إخفاء كامل" : "تشفير في النقل + تسجيل الوصول"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, ltr = false, icon: Icon }: { label: string; value: string; ltr?: boolean; icon?: typeof User }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground text-xs flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </span>
      <span className="font-medium text-xs truncate max-w-[60%]" dir={ltr ? "ltr" : undefined}>{value}</span>
    </div>
  );
}
