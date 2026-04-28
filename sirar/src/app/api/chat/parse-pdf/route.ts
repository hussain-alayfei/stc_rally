import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export const maxDuration = 30;
export const runtime = "nodejs";

export async function POST(req: Request) {
  let parser: PDFParse | null = null;
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText({ pageJoiner: "\n" });

    const text = result.text
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);

    return NextResponse.json({
      text,
      pages: result.total ?? 1,
      info: file.name,
    });
  } catch (e) {
    console.error("PDF parse error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to parse PDF" },
      { status: 500 }
    );
  } finally {
    if (parser) {
      try { await parser.destroy(); } catch { /* ignore */ }
    }
  }
}
