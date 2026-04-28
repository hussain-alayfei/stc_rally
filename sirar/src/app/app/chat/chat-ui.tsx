"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useTransition } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  createConversation,
  deleteConversation,
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
  conversations: Conversation[];
  initialMessages: InitialMessage[];
}

export function ChatUI({
  conversationId,
  conversations,
  initialMessages,
}: ChatUIProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [extracted, setExtracted] = useState<ExtractedRecord[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      // Extract any tool results and add to summary
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
            // Refresh data list in background
            router.refresh();
          }
        }
      );
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const personalRecord = extracted.find((e) => e.type === "personal");
  const financialRecord = extracted.find((e) => e.type === "financial");
  const hasData = extracted.length > 0;
  const hasHighRisk = extracted.some((e) => e.category === "A");

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-4 lg:-m-6 gap-0">
      {/* History Sidebar */}
      <div className="hidden md:flex w-56 bg-white border-s border-border flex-col shrink-0">
        <div className="p-3 border-b border-border">
          <Button
            onClick={handleNewConversation}
            disabled={pending}
            className="w-full bg-brand hover:bg-brand-hover rounded-xl gap-2 text-sm h-10"
          >
            <Plus className="h-4 w-4" />
            محادثة جديدة
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
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
                  <span className="flex-1 truncate">{conv.title}</span>
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
        </ScrollArea>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-surface min-w-0">
        <ScrollArea className="flex-1 p-4 lg:p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Welcome message if empty */}
            {messages.length === 0 && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tr-md p-4 shadow-sm border border-border max-w-md">
                  <p className="text-sm leading-relaxed">
                    مرحباً 👋
                    <br />
                    أنا سرار، مساعدك الذكي لإدارة وحماية بياناتك.
                    <br />
                    لنبدأ، ما نوع البيانات التي ترغب في إدخالها؟
                  </p>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {[
                      "بيانات شخصية",
                      "بيانات مالية",
                      "بيانات صحية",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage({ text: `أريد إدخال ${q}` })}
                        disabled={isLoading}
                        className="text-[11px] bg-surface hover:bg-brand-light hover:text-brand px-2.5 py-1 rounded-full transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {formatTime(new Date())}
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const text = (msg.parts || [])
                .filter(
                  (p: { type: string; text?: string }): p is { type: "text"; text: string } =>
                    p.type === "text"
                )
                .map((p) => p.text)
                .join("");

              const toolParts = (msg.parts || []).filter(
                (p: { type: string }) =>
                  p.type.startsWith("tool-") &&
                  !p.type.includes("tool-input")
              );

              if (!text && toolParts.length === 0) return null;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-fade-in ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user" ? "bg-gray-200" : "bg-brand"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Shield className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="space-y-2 max-w-md">
                    {text && (
                      <div
                        className={`rounded-2xl p-4 shadow-sm border text-sm ${
                          msg.role === "user"
                            ? "bg-brand-light rounded-tl-md border-brand-muted/30"
                            : "bg-white rounded-tr-md border-border"
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {text}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2">
                          {formatTime(new Date())}
                        </p>
                      </div>
                    )}

                    {/* Tool result cards */}
                    {toolParts.map((tp, i) => {
                      const tpAny = tp as {
                        type: string;
                        output?: { ok?: boolean; type?: string; category?: string; display?: Record<string, string | number> };
                      };
                      const out = tpAny.output;
                      if (!out?.ok) return null;
                      return (
                        <div
                          key={i}
                          className="bg-gradient-to-br from-green-50 to-brand-light border border-green-200 rounded-2xl p-3 text-sm animate-fade-in"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="font-bold text-xs">
                              ✅ تم حفظ{" "}
                              {out.type === "personal"
                                ? "البيانات الشخصية"
                                : "البيانات المالية"}
                            </span>
                            <Badge
                              className={`ms-auto text-[10px] border-0 ${
                                out.category === "A"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              فئة {out.category}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            تم تطبيق التشفير وتحديد صلاحيات الوصول تلقائياً
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {isLoading &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3 animate-fade-in">
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
                      <span className="text-[10px] text-muted-foreground">
                        محرّك سرار يحلل...
                      </span>
                    </div>
                  </div>
                </div>
              )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 bg-white border-t border-border">
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 rounded-xl bg-surface border-0 h-11"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-brand hover:bg-brand-hover rounded-xl h-11 w-11 shrink-0"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right Panel — LIVE summary */}
      <div className="hidden lg:flex w-80 bg-white border-s border-border flex-col shrink-0 overflow-y-auto">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand" />
            <h3 className="font-bold text-sm">ملخص البيانات المدخلة</h3>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {!hasData ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 mx-auto mb-3 bg-surface rounded-2xl flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                لم يتم إدخال بيانات بعد
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                ستظهر هنا تلقائياً بمجرد بدء المحادثة
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm animate-fade-in">
                <CheckCircle className="h-4 w-4" />
                <span>تم إدخال البيانات بنجاح</span>
              </div>

              {personalRecord && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">
                      البيانات الشخصية
                    </h4>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    {personalRecord.display.name as string && (
                      <SummaryRow
                        label="الاسم"
                        value={personalRecord.display.name as string}
                      />
                    )}
                    {personalRecord.display.email as string && (
                      <SummaryRow
                        icon={Mail}
                        label="البريد"
                        value={personalRecord.display.email as string}
                        ltr
                      />
                    )}
                    {personalRecord.display.phone as string && (
                      <SummaryRow
                        icon={Phone}
                        label="الجوال"
                        value={personalRecord.display.phone as string}
                        ltr
                      />
                    )}
                    {personalRecord.display.birth_date as string && (
                      <SummaryRow
                        icon={Calendar}
                        label="تاريخ الميلاد"
                        value={personalRecord.display.birth_date as string}
                      />
                    )}
                    {personalRecord.display.national_id as string && (
                      <SummaryRow
                        icon={IdCard}
                        label="الهوية"
                        value={`****${(personalRecord.display.national_id as string).slice(-2)}`}
                        ltr
                      />
                    )}
                  </div>
                  <Badge className="mt-3 bg-green-50 text-green-700 border-green-200 text-[10px]">
                    تم التحقق والتصنيف ✓ فئة {personalRecord.category}
                  </Badge>
                </div>
              )}

              {financialRecord && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">
                      البيانات المالية
                    </h4>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    {financialRecord.display.bank_name as string && (
                      <SummaryRow
                        icon={Building2}
                        label="البنك"
                        value={financialRecord.display.bank_name as string}
                      />
                    )}
                    {financialRecord.display.account_masked as string && (
                      <SummaryRow
                        label="الحساب"
                        value={financialRecord.display.account_masked as string}
                        ltr
                      />
                    )}
                    {(financialRecord.display.balance as number) !==
                      undefined && (
                      <SummaryRow
                        label="الرصيد"
                        value={`${(financialRecord.display.balance as number).toLocaleString()} SAR`}
                        ltr
                      />
                    )}
                  </div>
                  <Badge className="mt-3 bg-red-50 text-red-700 border-red-200 text-[10px]">
                    تم التحقق والتصنيف ✓ فئة A
                  </Badge>
                </div>
              )}

              <div
                className={`rounded-xl p-4 ${hasHighRisk ? "bg-red-50" : "bg-surface"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lock
                    className={`h-4 w-4 ${hasHighRisk ? "text-red-500" : "text-brand"}`}
                  />
                  <span className="font-semibold text-sm">مستوى الحماية</span>
                  <Badge
                    className={`ms-auto text-[10px] ${
                      hasHighRisk
                        ? "bg-red-100 text-red-700 border-red-200"
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}
                  >
                    {hasHighRisk ? "عالي جداً" : "متوسط"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {hasHighRisk
                    ? "تشفير AES-256 + إخفاء كامل + وصول مقيد للمدراء"
                    : "تشفير في النقل + تسجيل كامل للوصول"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  ltr = false,
  icon: Icon,
}: {
  label: string;
  value: string;
  ltr?: boolean;
  icon?: typeof User;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground text-xs flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </span>
      <span
        className="font-medium text-xs truncate max-w-[60%]"
        dir={ltr ? "ltr" : undefined}
      >
        {value}
      </span>
    </div>
  );
}
