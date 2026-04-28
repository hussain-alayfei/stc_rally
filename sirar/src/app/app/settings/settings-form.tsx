"use client";

import { useState, useTransition } from "react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions";

interface SettingsFormProps {
  fullName: string;
  email: string;
  role: string;
}

const roleLabels: Record<string, string> = {
  admin: "مدير النظام",
  manager: "مدير القسم",
  user: "موظف",
};

export function SettingsForm({ fullName, email, role }: SettingsFormProps) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(fullName);

  function handleSubmit(formData: FormData) {
    setError("");
    setSaved(false);
    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">
          الاسم الكامل
        </label>
        <Input
          name="full_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-xl"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">
          البريد الإلكتروني
        </label>
        <Input
          value={email}
          disabled
          className="rounded-xl bg-surface"
          dir="ltr"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">الدور</label>
        <Input
          value={roleLabels[role] || role}
          disabled
          className="rounded-xl bg-surface"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">
          {error}
        </p>
      )}
      {saved && (
        <p className="text-xs text-green-600 bg-green-50 p-2 rounded-lg flex items-center gap-1.5 animate-fade-in">
          <Check className="h-3.5 w-3.5" /> تم حفظ التغييرات بنجاح
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="bg-brand hover:bg-brand-hover rounded-xl gap-2"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "جاري الحفظ..." : "حفظ التغييرات"}
      </Button>
    </form>
  );
}
