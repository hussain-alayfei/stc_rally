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
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartProps {
  type: "pie" | "line";
  categoryCounts?: { A: number; B: number; C: number };
  timeline?: { date: string; count: number }[];
}

const COLORS = {
  A: "#EF4444",
  B: "#F59E0B",
  C: "#22C55E",
};

export default function ReportCharts({ type, categoryCounts, timeline }: ChartProps) {
  if (type === "pie" && categoryCounts) {
    const data = [
      { name: "فئة A", value: categoryCounts.A, color: COLORS.A },
      { name: "فئة B", value: categoryCounts.B, color: COLORS.B },
      { name: "فئة C", value: categoryCounts.C, color: COLORS.C },
    ].filter((d) => d.value > 0);

    if (data.length === 0) {
      return <p className="text-xs text-muted-foreground text-center py-8">لا توجد بيانات</p>;
    }

    return (
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => [`${Number(v)} سجل`, ""]}
              contentStyle={{ borderRadius: 12, border: "1px solid #E9E5F2", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 shrink-0">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-bold">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "line" && timeline) {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={timeline}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E5F2" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
          <Tooltip
            formatter={(v) => [`${Number(v)} سجل`, "عدد"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #E9E5F2", fontSize: 12 }}
          />
          <Line type="monotone" dataKey="count" stroke="#6F4FE8" strokeWidth={2} dot={{ r: 3, fill: "#6F4FE8" }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
