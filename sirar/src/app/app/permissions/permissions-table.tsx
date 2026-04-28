"use client";

import { useState, useTransition } from "react";
import { Users, UserCog, UserCheck, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { togglePermission } from "@/lib/actions";

interface Permission {
  role: string;
  category_id: string;
  can_view: boolean;
  can_export: boolean;
  can_modify: boolean;
}

const roles = [
  { id: "admin", label: "مدير النظام", icon: UserCog },
  { id: "manager", label: "مدير القسم", icon: Users },
  { id: "user", label: "موظف", icon: UserCheck },
];

const categories = [
  { id: "A", color: "bg-red-100 text-red-700" },
  { id: "B", color: "bg-amber-100 text-amber-700" },
  { id: "C", color: "bg-green-100 text-green-700" },
];

export function PermissionsTable({
  initial,
}: {
  initial: Permission[];
}) {
  const [perms, setPerms] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  function getValue(
    role: string,
    category: string,
    perm: "can_view" | "can_export" | "can_modify"
  ) {
    const found = perms.find(
      (p) => p.role === role && p.category_id === category
    );
    return found?.[perm] ?? false;
  }

  function handleToggle(
    role: string,
    category: string,
    perm: "can_view" | "can_export" | "can_modify"
  ) {
    const key = `${role}-${category}-${perm}`;
    const currentVal = getValue(role, category, perm);
    const newVal = !currentVal;

    setPerms((prev) =>
      prev.map((p) =>
        p.role === role && p.category_id === category
          ? { ...p, [perm]: newVal }
          : p
      )
    );
    setActiveKey(key);

    startTransition(async () => {
      const res = await togglePermission(role, category, perm, newVal);
      if (res?.error) {
        setPerms((prev) =>
          prev.map((p) =>
            p.role === role && p.category_id === category
              ? { ...p, [perm]: currentVal }
              : p
          )
        );
      }
      setActiveKey(null);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden animate-fade-in">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface border-b border-border">
            <th className="text-start p-4 font-medium">الدور</th>
            {categories.map((cat) => (
              <th
                key={cat.id}
                className="text-center p-4 font-medium"
                colSpan={3}
              >
                <Badge className={`${cat.color} border-0`}>فئة {cat.id}</Badge>
              </th>
            ))}
          </tr>
          <tr className="bg-surface/50 border-b border-border text-xs text-muted-foreground">
            <th />
            {categories.map((cat) => (
              <>
                <th key={`${cat.id}-v`} className="p-2 text-center font-normal">
                  عرض
                </th>
                <th key={`${cat.id}-e`} className="p-2 text-center font-normal">
                  تصدير
                </th>
                <th key={`${cat.id}-m`} className="p-2 text-center font-normal">
                  تعديل
                </th>
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr
              key={role.id}
              className="border-b border-border last:border-0 hover:bg-surface/30 transition-colors"
            >
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <role.icon className="h-4 w-4 text-brand" />
                  <span className="font-medium">{role.label}</span>
                </div>
              </td>
              {categories.map((cat) =>
                (["can_view", "can_export", "can_modify"] as const).map(
                  (perm) => {
                    const key = `${role.id}-${cat.id}-${perm}`;
                    const val = getValue(role.id, cat.id, perm);
                    const isLoading = activeKey === key && pending;
                    return (
                      <td key={key} className="p-2 text-center">
                        <button
                          onClick={() =>
                            handleToggle(role.id, cat.id, perm)
                          }
                          disabled={isLoading || pending}
                          className="inline-flex items-center justify-center group disabled:opacity-50"
                          title="انقر للتبديل"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-brand" />
                          ) : (
                            <div
                              className={`w-9 h-5 rounded-full relative transition-colors ${
                                val
                                  ? "bg-green-500"
                                  : "bg-gray-200 group-hover:bg-gray-300"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                                  val ? "end-0.5" : "start-0.5"
                                }`}
                              />
                            </div>
                          )}
                        </button>
                      </td>
                    );
                  }
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
