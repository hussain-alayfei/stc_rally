import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { SIRAR_SYSTEM_PROMPT } from "@/lib/ai/system-prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: SIRAR_SYSTEM_PROMPT,
    messages,
  });

  return result.toTextStreamResponse();
}
