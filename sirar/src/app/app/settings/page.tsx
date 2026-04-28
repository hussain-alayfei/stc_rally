import { Settings, User, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getDisplayName } from "@/lib/supabase/cache";
import { SettingsForm } from "./settings-form";
import { NotificationToggles } from "./notification-toggles";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { fullName, email, role } = await getDisplayName();

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-brand" />
          الإعدادات
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          إدارة إعدادات حسابك والنظام
        </p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-brand" />
          <h2 className="font-bold">الملف الشخصي</h2>
        </div>
        <SettingsForm fullName={fullName} email={email} role={role} />
      </div>

      <Separator />

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-brand" />
          <h2 className="font-bold">الإشعارات</h2>
        </div>
        <NotificationToggles />
      </div>

      <Separator />

      {/* Security */}
      <div className="bg-white rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-brand" />
          <h2 className="font-bold">الأمان</h2>
        </div>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full rounded-xl justify-start gap-2 hover:bg-brand-light hover:text-brand hover:border-brand-muted transition-all"
          >
            تغيير كلمة المرور
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-xl justify-start gap-2 hover:bg-brand-light hover:text-brand hover:border-brand-muted transition-all"
          >
            تفعيل المصادقة الثنائية
          </Button>
        </div>
      </div>
    </div>
  );
}
