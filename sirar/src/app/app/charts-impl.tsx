"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const distributionData = [
  { name: "فئة A (عالية)", value: 25, count: "632,345", color: "#EF4444" },
  { name: "فئة B (متوسطة)", value: 35, count: "858,642", color: "#F59E0B" },
  { name: "فئة C (منخفضة)", value: 30, count: "715,234", color: "#22C55E" },
  { name: "غير مصنفة", value: 10, count: "250,568", color: "#94A3B8" },
];

const trendData = [
  { month: "ديسمبر", value: 800000 },
  { month: "يناير", value: 1200000 },
  { month: "فبراير", value: 1500000 },
  { month: "مارس", value: 1800000 },
  { month: "أبريل", value: 2100000 },
  { month: "مايو", value: 2356789 },
];

export function DistributionChart() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-44 h-44 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              dataKey="value"
              strokeWidth={2}
              stroke="#fff"
              isAnimationActive={false}
            >
              {distributionData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="text-lg font-bold text-brand">2.45M</span>
            <p className="text-[10px] text-muted-foreground">إجمالي العناصر</p>
          </div>
        </div>
      </div>
      <div className="space-y-2.5 text-xs flex-1">
        {distributionData.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-muted-foreground flex-1 truncate">
              {d.name}
            </span>
            <span className="font-semibold">{d.value}%</span>
            <span className="text-muted-foreground text-[10px]">
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrendChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={trendData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E9E5F2" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#7A7494" />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke="#7A7494"
          tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
        />
        <Tooltip formatter={(v) => [Number(v).toLocaleString(), "عناصر"]} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#6F4FE8"
          strokeWidth={2.5}
          dot={{ fill: "#6F4FE8", r: 4 }}
          activeDot={{ r: 6 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
