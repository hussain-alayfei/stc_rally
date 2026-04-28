"use client";

import dynamic from "next/dynamic";

const ChartFallback = ({ height = 200 }: { height?: number }) => (
  <div
    className="bg-surface/40 rounded-xl animate-pulse"
    style={{ height: `${height}px` }}
  />
);

export const DistributionChart = dynamic(
  () => import("./charts-impl").then((m) => m.DistributionChart),
  { ssr: false, loading: () => <ChartFallback height={176} /> }
);

export const TrendChart = dynamic(
  () => import("./charts-impl").then((m) => m.TrendChart),
  { ssr: false, loading: () => <ChartFallback height={200} /> }
);
