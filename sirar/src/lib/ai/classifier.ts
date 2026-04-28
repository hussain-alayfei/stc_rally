export type FieldType =
  | "national_id"
  | "iban"
  | "phone"
  | "email"
  | "credit_card"
  | "birth_date"
  | "name"
  | "address"
  | "account_number"
  | "unknown";

export interface ClassifiedField {
  type: FieldType;
  value: string;
  category: "A" | "B" | "C";
  label: string;
}

const patterns: { type: FieldType; regex: RegExp; category: "A" | "B" | "C"; label: string }[] = [
  { type: "national_id", regex: /\b[12]\d{9}\b/, category: "A", label: "رقم الهوية" },
  { type: "iban", regex: /SA\d{22}/i, category: "A", label: "رقم الآيبان" },
  { type: "credit_card", regex: /\b(?:4\d{3}|5[1-5]\d{2}|6011)\s?\d{4}\s?\d{4}\s?\d{4}\b/, category: "A", label: "بطاقة ائتمان" },
  { type: "phone", regex: /\+?966\s?\d{2}\s?\d{3}\s?\d{4}/, category: "B", label: "رقم الجوال" },
  { type: "email", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, category: "B", label: "البريد الإلكتروني" },
  { type: "birth_date", regex: /\b(19|20)\d{2}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/, category: "A", label: "تاريخ الميلاد" },
  { type: "account_number", regex: /\b\d{10,16}\b/, category: "A", label: "رقم الحساب" },
];

export function classifyText(text: string): ClassifiedField[] {
  const results: ClassifiedField[] = [];
  for (const pattern of patterns) {
    const match = text.match(pattern.regex);
    if (match) {
      results.push({
        type: pattern.type,
        value: match[0],
        category: pattern.category,
        label: pattern.label,
      });
    }
  }
  return results;
}

export function getHighestCategory(fields: ClassifiedField[]): "A" | "B" | "C" {
  if (fields.some((f) => f.category === "A")) return "A";
  if (fields.some((f) => f.category === "B")) return "B";
  return "C";
}
