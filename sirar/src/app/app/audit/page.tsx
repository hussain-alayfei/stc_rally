import { ClipboardList, Clock, User, Shield, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getDisplayName } from "@/lib/supabase/cache";

export const dynamic = "force-dynamic";

interface AuditLogRow {
  id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip: string | null;
  created_at: string;
}

export default async function AuditPage() {
  const supabase = await createClient();
  const { fullName: userName } = await getDisplayName();

  const { data: rawLogs } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const logs: AuditLogRow[] = rawLogs ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-brand" />
            سجل العمليات
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            تتبع جميع العمليات والأنشطة في النظام — مباشر من قاعدة البيانات
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white px-3 py-2 rounded-xl border border-border">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>{logs.length} سجل</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Inbox className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium">لا توجد سجلات بعد</p>
            <p className="text-xs text-muted-foreground mt-1">
              ستظهر هنا جميع العمليات التي تتم في النظام تلقائياً
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border text-muted-foreground">
                <th className="text-start p-3 font-medium">الإجراء</th>
                <th className="text-start p-3 font-medium">المستخدم</th>
                <th className="text-start p-3 font-medium">الهدف</th>
                <th className="text-start p-3 font-medium">الوقت</th>
                <th className="text-start p-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const d = new Date(log.created_at);
                const time = d.toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const date = d.toLocaleDateString("ar-SA", {
                  day: "numeric",
                  month: "long",
                });
                return (
                  <tr
                    key={log.id}
                    className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-brand" />
                        <span className="font-medium">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {userName}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {log.target_type || "—"}
                      {log.target_id && (
                        <span className="font-mono ms-1 text-[10px]">
                          #{log.target_id.slice(0, 8)}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{time}</span>
                        <span className="text-xs">· {date}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        className="bg-surface text-muted-foreground border-0 text-xs font-mono"
                        dir="ltr"
                      >
                        {log.ip || "—"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
