"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-lg font-bold">حدث خطأ غير متوقع</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.
      </p>
      <Button onClick={reset} variant="outline" className="gap-2 rounded-xl">
        <RotateCcw className="h-4 w-4" />
        إعادة المحاولة
      </Button>
    </div>
  );
}
