"use client";

import { Settings, User, Bell, Shield, Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 text-brand" />
          الإعدادات
        </h1>
        <p className="text-muted-foreground text-sm mt-1">إدارة إعدادات حسابك والنظام</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-brand" />
          <h2 className="font-bold">الملف الشخصي</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">الاسم الكامل</label>
            <Input defaultValue="سارة أحمد" className="rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني</label>
            <Input defaultValue="sara@example.com" className="rounded-xl" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">الدور</label>
            <Input defaultValue="مدير النظام" className="rounded-xl" disabled />
          </div>
          <Button className="bg-brand hover:bg-brand-hover rounded-xl">حفظ التغييرات</Button>
        </div>
      </div>

      <Separator />

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-brand" />
          <h2 className="font-bold">الإشعارات</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "تنبيهات الأمان", desc: "تلقي إشعارات عند اكتشاف تهديدات" },
            { label: "تحديثات النظام", desc: "تلقي إشعارات عند تحديث النظام" },
            { label: "تقارير أسبوعية", desc: "تلقي ملخص أسبوعي بالبريد" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <div className="w-10 h-6 bg-brand rounded-full relative cursor-pointer">
                <div className="absolute start-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Security */}
      <div className="bg-white rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-brand" />
          <h2 className="font-bold">الأمان</h2>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full rounded-xl justify-start gap-2">
            تغيير كلمة المرور
          </Button>
          <Button variant="outline" className="w-full rounded-xl justify-start gap-2">
            تفعيل المصادقة الثنائية
          </Button>
        </div>
      </div>
    </div>
  );
}
