"use client";

import { Shield, Users, UserCog, UserCheck, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const permissionMatrix = [
  {
    role: "مدير النظام",
    roleIcon: UserCog,
    permissions: { A: { view: true, export: true, modify: true }, B: { view: true, export: true, modify: true }, C: { view: true, export: true, modify: true } },
  },
  {
    role: "مدير القسم",
    roleIcon: Users,
    permissions: { A: { view: false, export: false, modify: false }, B: { view: true, export: true, modify: false }, C: { view: true, export: true, modify: true } },
  },
  {
    role: "موظف",
    roleIcon: UserCheck,
    permissions: { A: { view: false, export: false, modify: false }, B: { view: false, export: false, modify: false }, C: { view: true, export: false, modify: false } },
  },
];

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-brand" />
          الصلاحيات
        </h1>
        <p className="text-muted-foreground text-sm mt-1">إدارة صلاحيات الوصول لكل دور حسب فئة البيانات</p>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border">
              <th className="text-start p-4 font-medium">الدور</th>
              {["A", "B", "C"].map((cat) => (
                <th key={cat} className="text-center p-4 font-medium" colSpan={3}>
                  <Badge className={`${cat === "A" ? "bg-red-100 text-red-700" : cat === "B" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"} border-0`}>
                    فئة {cat}
                  </Badge>
                </th>
              ))}
            </tr>
            <tr className="bg-surface/50 border-b border-border text-xs text-muted-foreground">
              <th />
              {["A", "B", "C"].map((cat) => (
                <>
                  <th key={`${cat}-v`} className="p-2 text-center">عرض</th>
                  <th key={`${cat}-e`} className="p-2 text-center">تصدير</th>
                  <th key={`${cat}-m`} className="p-2 text-center">تعديل</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionMatrix.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <row.roleIcon className="h-4 w-4 text-brand" />
                    <span className="font-medium">{row.role}</span>
                  </div>
                </td>
                {(["A", "B", "C"] as const).map((cat) =>
                  (["view", "export", "modify"] as const).map((perm) => (
                    <td key={`${cat}-${perm}`} className="p-2 text-center">
                      {row.permissions[cat][perm] ? (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-red-400 mx-auto" />
                      )}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
