"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import {
  Send,
  MessageSquare,
  Shield,
  User,
  CheckCircle,
  CreditCard,
  LayoutDashboard,
  Database,
  Tags,
  FileText,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Logo } from "@/components/logo";

const chatNavItems = [
  { label: "لوحة التحكم", href: "/app", icon: LayoutDashboard },
  { label: "البيانات", href: "/app/data", icon: Database },
  { label: "التصنيفات", href: "/app/classification", icon: Tags },
  { label: "التقارير", href: "/app/reports", icon: FileText },
  { label: "الإعدادات", href: "/app/settings", icon: Settings },
];

interface DataSummary {
  name?: string;
  email?: string;
  phone?: string;
  nationalId?: string;
  birthDate?: string;
  bankName?: string;
  accountNumber?: string;
  balance?: string;
}

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const isLoading = status === "streaming" || status === "submitted";

  const [dataSummary] = useState<DataSummary>({
    name: "سارة أحمد",
    email: "sara@example.com",
    phone: "+966 50 123 4567",
    birthDate: "1998-05-21",
    bankName: "البنك الأهلي السعودي",
    accountNumber: "****** ****** 1234",
    balance: "50,250.00 SAR",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-4 lg:-m-6 gap-0">
      {/* Chat Left Sidebar */}
      <div className="hidden md:flex w-52 bg-white border-s border-border flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <Link
            href="/app/chat"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm bg-brand-light text-brand font-medium"
          >
            <MessageSquare className="h-4 w-4" />
            <span>محادثة جديدة</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand ms-auto" />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {chatNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface rounded-xl transition-colors"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2 px-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-brand-light text-brand flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-medium">خطة تجريبية</p>
              <p className="text-[10px] text-muted-foreground">
                14 يوم متبقية
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold shrink-0">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">سارة أحمد</p>
              <p className="text-[10px] text-muted-foreground truncate">
                sara@example.com
              </p>
            </div>
            <ChevronIcon />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-surface min-w-0">
        <ScrollArea className="flex-1 p-4 lg:p-6">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Default welcome message */}
            {messages.length === 0 && (
              <>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tr-md p-4 shadow-sm border border-border max-w-md">
                    <p className="text-sm leading-relaxed">
                      مرحباً 👋
                      <br />
                      أنا هنا لمساعدتك في إدارة بياناتك وحمايتها.
                      <br />
                      لنبدأ، ما نوع البيانات التي ترغب في إدخالها؟
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      10:30 AM
                    </p>
                  </div>
                </div>

                {/* Sample user message */}
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-brand-light rounded-2xl rounded-tl-md p-4 shadow-sm border border-brand-muted/30 max-w-md">
                    <p className="text-sm leading-relaxed">
                      أريد إدخال بيانات شخصية ومالية
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      10:31 AM
                    </p>
                  </div>
                </div>

                {/* Assistant response */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tr-md p-4 shadow-sm border border-border max-w-md">
                    <p className="text-sm leading-relaxed">
                      حسناً، سأساعدك في إدخال البيانات بشكل آمن.
                      <br />
                      لنبدأ بالبيانات الشخصية. ما المعلومات التي ترغب في
                      إدخالها؟
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      10:31 AM
                    </p>
                  </div>
                </div>

                {/* User data message */}
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="bg-brand-light rounded-2xl rounded-tl-md p-4 shadow-sm border border-brand-muted/30 max-w-md">
                    <p className="text-sm leading-relaxed">
                      • الاسم: سارة أحمد
                      <br />
                      • البريد الإلكتروني: sara@example.com
                      <br />
                      • رقم الجوال: 4567 123 50 966+
                      <br />• تاريخ الميلاد: 1998-05-21
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      10:32 AM
                    </p>
                  </div>
                </div>

                {/* Assistant confirmation */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tr-md p-4 shadow-sm border border-border max-w-md">
                    <p className="text-sm leading-relaxed">
                      ✅ استلمت البيانات الشخصية بنجاح!
                      <br />
                      هل ترغب في إدخال بيانات مالية أيضاً؟
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      10:32 AM
                    </p>
                  </div>
                </div>
              </>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
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
                <div
                  className={`rounded-2xl p-4 shadow-sm border max-w-md ${
                    msg.role === "user"
                      ? "bg-brand-light rounded-tl-md border-brand-muted/30 text-sm"
                      : "bg-white rounded-tr-md border-border text-sm"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {msg.parts
                      ?.filter(
                        (p): p is { type: "text"; text: string } =>
                          p.type === "text"
                      )
                      .map((p, i) => (
                        <span key={i}>{p.text}</span>
                      ))}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {formatTime(new Date())}
                  </p>
                </div>
              </div>
            ))}

            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tr-md p-4 shadow-sm border border-border">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-brand/40 animate-bounce [animation-delay:0ms]" />
                      <div className="w-2 h-2 rounded-full bg-brand/40 animate-bounce [animation-delay:150ms]" />
                      <div className="w-2 h-2 rounded-full bg-brand/40 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
          </div>
        </ScrollArea>

        {/* Input */}
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

      {/* Right Panel - Data Summary */}
      <div className="hidden lg:flex w-80 bg-white border-s border-border flex-col shrink-0 overflow-y-auto">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand" />
            <h3 className="font-bold text-sm">ملخص البيانات المدخلة</h3>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Success banner */}
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>تم إدخال البيانات بنجاح</span>
          </div>

          {/* Personal Data */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">البيانات الشخصية</h4>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">الاسم</span>
                <span className="font-medium">{dataSummary.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  البريد الإلكتروني
                </span>
                <span className="font-medium text-xs" dir="ltr">
                  {dataSummary.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">رقم الجوال</span>
                <span className="font-medium text-xs" dir="ltr">
                  {dataSummary.phone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تاريخ الميلاد</span>
                <span className="font-medium">{dataSummary.birthDate}</span>
              </div>
            </div>
            <Badge className="mt-2 bg-green-50 text-green-700 border-green-200 text-[10px]">
              تم التحقق والتصنيف كبيانات شخصية
            </Badge>
          </div>

          {/* Financial Data */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">البيانات المالية</h4>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">رقم الحساب</span>
                <span className="font-medium text-xs" dir="ltr">
                  {dataSummary.accountNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">البنك</span>
                <span className="font-medium">{dataSummary.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الرصيد</span>
                <span className="font-medium" dir="ltr">
                  {dataSummary.balance}
                </span>
              </div>
            </div>
            <Badge className="mt-2 bg-green-50 text-green-700 border-green-200 text-[10px]">
              تم التحقق والتصنيف كبيانات مالية
            </Badge>
          </div>

          {/* Protection Level */}
          <div className="bg-surface rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-brand" />
              <span className="font-semibold text-sm">مستوى الحماية</span>
              <Badge className="ms-auto bg-red-50 text-red-600 border-red-200 text-[10px]">
                عالي
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              جميع بياناتك محمية وفق أعلى معايير الأمان
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-4 w-4 text-muted-foreground"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
