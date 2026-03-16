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

interface WeeklyLog {
  revenue: number;
  visitors_brought: number;
  one_on_ones_had: number;
  referrals_given: number;
  created_at: string;
}

interface DashboardChartsProps {
  data: WeeklyLog[];
}

const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface MetricChartProps {
  title: string;
  dataKey: string;
  color: string;
  chartData: any[];
  formatAsCurrency?: boolean;
}

function MetricChart({ title, dataKey, color, chartData, formatAsCurrency }: MetricChartProps) {
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
              tickFormatter={formatAsCurrency ? (v) => `$${v/1000}k` : undefined}
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

export function DashboardCharts({ data }: DashboardChartsProps) {
  const monthlyTotals = data.reduce((acc, log) => {
    const month = new Date(log.created_at).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { date: month, revenue: 0, visitors: 0, oneOnOnes: 0, thanked: 0 };
    }
    acc[month].revenue += log.revenue || 0;
    acc[month].visitors += log.visitors_brought || 0;
    acc[month].oneOnOnes += log.one_on_ones_had || 0;
    acc[month].thanked += log.referrals_given || 0;
    return acc;
  }, {} as Record<string, { date: string; revenue: number; visitors: number; oneOnOnes: number; thanked: number; }>);

  const chartData = monthOrder
    .map(month => monthlyTotals[month])
    .filter(Boolean);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <MetricChart
        title="Revenue by Month"
        dataKey="revenue"
        color="#4CAF50"
        chartData={chartData}
        formatAsCurrency
      />
      <MetricChart
        title="Visitors by Month"
        dataKey="visitors"
        color="#2196F3"
        chartData={chartData}
      />
      <MetricChart
        title="1-on-1s by Month"
        dataKey="oneOnOnes"
        color="#9C27B0"
        chartData={chartData}
      />
      <MetricChart
        title="Members Thanked by Month"
        dataKey="thanked"
        color="#FF9800"
        chartData={chartData}
      />
    </div>
  );
}
