import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/auth";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  const auth = await validateApiKey(req);
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabase
    .from("data_records")
    .select("*")
    .eq("user_id", auth.userId!)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count: data?.length || 0 });
}

export async function POST(req: NextRequest) {
  const auth = await validateApiKey(req);
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("data_records")
    .insert({
      user_id: auth.userId,
      source: "api",
      category: body.category || "C",
      sensitivity_score: body.sensitivity_score || 0,
      data_type: body.data_type || "general",
      name: body.name || "",
      email: body.email,
      phone: body.phone,
      national_id: body.national_id,
      birth_date: body.birth_date,
      address: body.address,
      bank_name: body.bank_name,
      account_number: body.account_number,
      balance: body.balance,
      fields: body.fields || {},
      masked_fields: body.masked_fields || {},
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data }, { status: 201 });
}
