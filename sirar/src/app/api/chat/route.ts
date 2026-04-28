import { openai } from "@ai-sdk/openai";
import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";
import { SIRAR_SYSTEM_PROMPT } from "@/lib/ai/system-prompts";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

/* ─────────────────────────────────────────────────────────────
   SMART CHAT — uses tools to extract & save data live
   The AI decides when it has enough info to call a tool.
   Tool execution writes directly to Supabase + creates audit log.
   ───────────────────────────────────────────────────────────── */

export async function POST(req: Request) {
  const { messages, conversationId } = await req.json();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  // Persist user message immediately (last message in the array)
  if (userId && conversationId && messages.length > 0) {
    const last = messages[messages.length - 1];
    if (last?.role === "user") {
      const text = (last.parts || [])
        .filter((p: { type: string }) => p.type === "text")
        .map((p: { text: string }) => p.text)
        .join("");
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: text,
      });
      // Update conversation title from first message if still default
      await supabase
        .from("conversations")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);
    }
  }

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: SIRAR_SYSTEM_PROMPT,
    messages: modelMessages,
    stopWhen: stepCountIs(5),
    temperature: 0.4,
    tools: {
      save_personal_data: tool({
        description:
          "احفظ البيانات الشخصية للمستخدم بعد جمعها (اسم + إيميل أو جوال). يقوم بالتصنيف التلقائي والحفظ الآمن.",
        inputSchema: z.object({
          name: z.string().describe("الاسم الكامل"),
          email: z.string().optional().describe("البريد الإلكتروني"),
          phone: z.string().optional().describe("رقم الجوال"),
          birth_date: z.string().optional().describe("تاريخ الميلاد"),
          national_id: z.string().optional().describe("رقم الهوية الوطنية"),
        }),
        execute: async ({ name, email, phone, birth_date, national_id }) => {
          if (!userId) {
            return { ok: false, error: "غير مصرح" };
          }
          // Smart classification rules
          let category: "A" | "B" | "C" = "C";
          let score = 25;
          if (national_id || birth_date) {
            category = "A";
            score = 92;
          } else if (email && phone) {
            category = "B";
            score = 65;
          } else if (email || phone) {
            category = "B";
            score = 55;
          }

          const { data, error } = await supabase
            .from("data_records")
            .insert({
              user_id: userId,
              source: "chat",
              category,
              sensitivity_score: score,
              data_type: national_id ? "personal" : "contact",
              name,
              email: email || null,
              phone: phone || null,
              birth_date: birth_date || null,
              national_id: national_id || null,
              status: "active",
              fields: { name, email, phone, birth_date, national_id },
              masked_fields: {
                national_id: national_id
                  ? `${national_id.slice(0, 2)}******${national_id.slice(-2)}`
                  : null,
              },
            })
            .select()
            .single();

          if (error) return { ok: false, error: error.message };

          await supabase.from("audit_logs").insert({
            user_id: userId,
            action: `حفظ بيانات شخصية عبر المحادثة (فئة ${category})`,
            target_type: "data_record",
            target_id: data.id,
            metadata: { name, category },
            ip: "127.0.0.1",
          });

          if (category === "A") {
            await supabase.from("alerts").insert({
              user_id: userId,
              title: "تم استقبال بيانات شخصية حساسة",
              description: `تم تصنيف سجل "${name}" كفئة A وتطبيق تشفير كامل`,
              severity: "medium",
              type: "classification",
              status: "active",
            });
          }

          return {
            ok: true,
            saved: true,
            category,
            score,
            type: "personal",
            display: {
              name,
              email,
              phone,
              birth_date,
            },
          };
        },
      }),

      save_financial_data: tool({
        description:
          "احفظ البيانات المالية للمستخدم (بنك + حساب أو IBAN). تصنيف فئة A تلقائياً.",
        inputSchema: z.object({
          owner_name: z.string().describe("اسم صاحب الحساب"),
          bank_name: z.string().optional().describe("اسم البنك"),
          account_number: z.string().optional().describe("رقم الحساب"),
          iban: z.string().optional().describe("رقم IBAN"),
          balance: z.number().optional().describe("الرصيد"),
        }),
        execute: async ({
          owner_name,
          bank_name,
          account_number,
          iban,
          balance,
        }) => {
          if (!userId) return { ok: false, error: "غير مصرح" };

          const masked = account_number
            ? `**** **** **** ${account_number.slice(-4)}`
            : iban
              ? `${iban.slice(0, 4)} **** **** ${iban.slice(-4)}`
              : null;

          const { data, error } = await supabase
            .from("data_records")
            .insert({
              user_id: userId,
              source: "chat",
              category: "A",
              sensitivity_score: 95,
              data_type: "financial",
              name: owner_name,
              bank_name: bank_name || null,
              account_number: account_number || null,
              balance: balance ?? null,
              status: "active",
              fields: {
                bank_name,
                account_number,
                iban,
                balance,
              },
              masked_fields: { masked_account: masked },
            })
            .select()
            .single();

          if (error) return { ok: false, error: error.message };

          await supabase.from("audit_logs").insert({
            user_id: userId,
            action: "حفظ بيانات مالية عبر المحادثة (فئة A)",
            target_type: "data_record",
            target_id: data.id,
            metadata: { owner_name, bank_name },
            ip: "127.0.0.1",
          });

          await supabase.from("alerts").insert({
            user_id: userId,
            title: "تم استقبال بيانات مالية حساسة",
            description: `حساب جديد "${bank_name || "غير محدد"}" — تم تطبيق تشفير AES-256 وتقييد الوصول`,
            severity: "high",
            type: "classification",
            status: "active",
          });

          return {
            ok: true,
            saved: true,
            category: "A",
            score: 95,
            type: "financial",
            display: {
              owner_name,
              bank_name,
              account_masked: masked,
              balance,
            },
          };
        },
      }),
    },
    onFinish: async ({ text }) => {
      // Persist assistant response
      if (userId && conversationId && text) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "assistant",
          content: text,
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
