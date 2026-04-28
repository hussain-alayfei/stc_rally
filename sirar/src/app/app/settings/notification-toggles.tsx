"use client";

import { useState } from "react";

const items = [
  {
    id: "security",
    label: "تنبيهات الأمان",
    desc: "تلقي إشعارات عند اكتشاف تهديدات",
  },
  {
    id: "updates",
    label: "تحديثات النظام",
    desc: "تلقي إشعارات عند تحديث النظام",
  },
  {
    id: "weekly",
    label: "تقارير أسبوعية",
    desc: "تلقي ملخص أسبوعي بالبريد",
  },
];

export function NotificationToggles() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    security: true,
    updates: true,
    weekly: false,
  });

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOn = enabled[item.id];
        return (
          <div
            key={item.id}
            className="flex items-center justify-between py-2"
          >
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setEnabled((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
              }
              className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${
                isOn ? "bg-brand" : "bg-gray-200"
              }`}
              aria-pressed={isOn}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                  isOn ? "end-0.5" : "start-0.5"
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
