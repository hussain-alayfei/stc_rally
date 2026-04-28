import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/auth";
import { classifyText, getHighestCategory } from "@/lib/ai/classifier";
import { maskValue } from "@/lib/utils/mask";

export async function POST(req: NextRequest) {
  const auth = await validateApiKey(req);
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const text = body.text || "";
  const fields = body.fields || {};

  const classified = classifyText(text);
  const category = classified.length > 0 ? getHighestCategory(classified) : "C";

  const maskedFields: Record<string, string> = {};
  for (const field of classified) {
    maskedFields[field.type] = maskValue(field.value, field.type === "national_id" ? "id" : field.type === "phone" ? "phone" : field.type === "email" ? "email" : "text");
  }

  return NextResponse.json({
    category,
    sensitivity_level: category === "A" ? "عالية" : category === "B" ? "متوسطة" : "منخفضة",
    detected_fields: classified,
    masked_fields: maskedFields,
    field_count: classified.length,
  });
}
