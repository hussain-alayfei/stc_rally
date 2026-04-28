import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const maxDuration = 10;

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message || typeof message !== "string") {
    return Response.json({ title: "محادثة جديدة" });
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system:
        "أنت مساعد يُنشئ عناوين قصيرة للمحادثات. أعطِ عنواناً عربياً من 3 إلى 6 كلمات يصف موضوع الرسالة. لا تضع علامات ترقيم في البداية أو النهاية. أجب بالعنوان فقط بدون أي شرح.",
      prompt: message.slice(0, 300),
      maxTokens: 30,
    });

    const title = text.trim().replace(/^["'«]+|["'»]+$/g, "");
    return Response.json({ title: title || "محادثة جديدة" });
  } catch {
    return Response.json({ title: "محادثة جديدة" });
  }
}
