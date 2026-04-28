"use client";

import { useState, useTransition } from "react";
import {
  Search,
  Download,
  Eye,
  Trash2,
  X,
  Inbox,
  Mail,
  Phone,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { deleteDataRecord } from "@/lib/actions";
import { AiAddModal } from "./ai-add-modal";

interface DataRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  data_type: string;
  category: string;
  status: string;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  A: "bg-red-100 text-red-700",
  B: "bg-amber-100 text-amber-700",
  C: "bg-green-100 text-green-700",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "نشط", color: "bg-green-100 text-green-700" },
  flagged: { label: "مُعلّم", color: "bg-red-100 text-red-700" },
  archived: { label: "مؤرشف", color: "bg-gray-100 text-gray-700" },
};

const typeLabels: Record<string, string> = {
  personal: "شخصية",
  financial: "مالية",
  medical: "صحية",
  contact: "اتصال",
};

export function DataTable({ initial }: { initial: DataRecord[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "A" | "B" | "C">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [viewing, setViewing] = useState<DataRecord | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = initial.filter((r) => {
    if (filter !== "all" && r.category !== filter) return false;
    if (
      search &&
      !r.name.toLowerCase().includes(search.toLowerCase()) &&
      !(r.email || "").toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  function handleExport() {
    const headers = ["الاسم", "النوع", "التصنيف", "الحالة", "البريد", "الهاتف", "التاريخ"];
    const rows = filtered.map((r) => [
      r.name,
      typeLabels[r.data_type] || r.data_type,
      `فئة ${r.category}`,
      statusLabels[r.status]?.label ?? r.status,
      r.email || "",
      r.phone || "",
      new Date(r.created_at).toLocaleDateString("ar-SA"),
    ]);
    const csv =
      "\uFEFF" +
      [headers, ...rows]
        .map((row) =>
          row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sirar-data-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا السجل؟")) return;
    startTransition(async () => {
      await deleteDataRecord(id);
      setViewing(null);
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث في البيانات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10 rounded-xl bg-white"
          />
        </div>
        <div className="flex items-center gap-1 bg-white rounded-xl border border-border p-1">
          {(["all", "A", "B", "C"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? "bg-brand text-white shadow-sm"
                  : "text-muted-foreground hover:bg-surface"
              }`}
            >
              {f === "all" ? "الكل" : `فئة ${f}`}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          className="rounded-xl gap-2 text-sm"
        >
          <Download className="h-4 w-4" /> تصدير
        </Button>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-gradient-to-r from-brand to-brand-hover hover:opacity-90 rounded-xl gap-2 shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          إضافة بتصنيف ذكي
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Inbox className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium">لا توجد بيانات</p>
            <p className="text-xs text-muted-foreground mt-1">
              {initial.length === 0
                ? "ابدأ بإضافة سجل بيانات جديد"
                : "جرّب تغيير معايير البحث أو الفلترة"}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border text-muted-foreground">
                <th className="text-start p-3 font-medium">الاسم</th>
                <th className="text-start p-3 font-medium">النوع</th>
                <th className="text-start p-3 font-medium">التصنيف</th>
                <th className="text-start p-3 font-medium">الحالة</th>
                <th className="text-start p-3 font-medium">التاريخ</th>
                <th className="text-start p-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                >
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3 text-muted-foreground">
                    {typeLabels[r.data_type] || r.data_type}
                  </td>
                  <td className="p-3">
                    <Badge
                      className={`${categoryColors[r.category]} border-0 text-xs`}
                    >
                      فئة {r.category}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      className={`${statusLabels[r.status]?.color} border-0 text-xs`}
                    >
                      {statusLabels[r.status]?.label ?? r.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {new Date(r.created_at).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewing(r)}
                        className="h-8 w-8 hover:bg-brand-light hover:text-brand"
                        title="عرض"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(r.id)}
                        disabled={pending}
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-500"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* AI Add Modal */}
      {showAdd && <AiAddModal onClose={() => setShowAdd(false)} />}

      {/* View Modal */}
      {viewing && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">تفاصيل السجل</h3>
              <button
                onClick={() => setViewing(null)}
                className="p-1 rounded-lg hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  className={`${categoryColors[viewing.category]} border-0`}
                >
                  فئة {viewing.category}
                </Badge>
                <Badge
                  className={`${statusLabels[viewing.status]?.color} border-0`}
                >
                  {statusLabels[viewing.status]?.label}
                </Badge>
              </div>
              <div className="bg-surface rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">الاسم</p>
                <p className="font-medium">{viewing.name}</p>
              </div>
              {viewing.email && (
                <div className="bg-surface rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Mail className="h-3 w-3" /> البريد
                  </div>
                  <p className="font-medium" dir="ltr">{viewing.email}</p>
                </div>
              )}
              {viewing.phone && (
                <div className="bg-surface rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Phone className="h-3 w-3" /> الهاتف
                  </div>
                  <p className="font-medium" dir="ltr">{viewing.phone}</p>
                </div>
              )}
              <div className="bg-surface rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Calendar className="h-3 w-3" /> تاريخ الإضافة
                </div>
                <p className="font-medium text-sm">
                  {new Date(viewing.created_at).toLocaleString("ar-SA")}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleDelete(viewing.id)}
                disabled={pending}
              >
                <Trash2 className="h-4 w-4 me-1" /> حذف
              </Button>
              <Button
                className="flex-1 bg-brand hover:bg-brand-hover rounded-xl"
                onClick={() => setViewing(null)}
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
