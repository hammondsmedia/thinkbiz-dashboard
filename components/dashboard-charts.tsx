"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { date: "Jan", revenue: 1200, visitors: 2, oneOnOnes: 4, thanked: 1 },
  { date: "Feb", revenue: 2500, visitors: 4, oneOnOnes: 6, thanked: 3 },
  { date: "Mar", revenue: 1800, visitors: 1, oneOnOnes: 5, thanked: 2 },
  { date: "Apr", revenue: 3200, visitors: 5, oneOnOnes: 9, thanked: 2 },
];

interface MetricChartProps {
  title: string;
  dataKey: string;
  color: string;
  formatAsCurrency?: boolean;
}

function MetricChart({ title, dataKey, color, formatAsCurrency }: MetricChartProps) {
  const formatValue = (value: number) =>
    formatAsCurrency ? `$${value.toLocaleString()}` : value.toString();

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-card-foreground">{title}</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatAsCurrency ? (v) => `$${v}` : undefined}
              width={formatAsCurrency ? 50 : 30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "13px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value: number) => [formatValue(value), title]}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "var(--color-card)" }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: "var(--color-card)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <MetricChart
        title="Revenue by Month"
        dataKey="revenue"
        color="#4CAF50"
        formatAsCurrency
      />
      <MetricChart
        title="Visitors by Month"
        dataKey="visitors"
        color="#2196F3"
      />
      <MetricChart
        title="1-on-1s by Month"
        dataKey="oneOnOnes"
        color="#9C27B0"
      />
      <MetricChart
        title="Members Thanked by Month"
        dataKey="thanked"
        color="#FF9800"
      />
    </div>
  );
}
