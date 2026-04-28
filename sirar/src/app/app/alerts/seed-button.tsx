"use client";

import { useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { seedDemoAlerts } from "@/lib/actions";

export function SeedAlertsButton() {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await seedDemoAlerts();
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={pending}
      variant="outline"
      className="rounded-xl gap-2 text-sm"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4 text-brand" />
      )}
      تحميل بيانات توضيحية
    </Button>
  );
}
