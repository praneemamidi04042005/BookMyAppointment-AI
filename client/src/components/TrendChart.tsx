import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export type TrendSeries = {
  label: string;
  unit: string;
  dataPoints: Array<{ date: string; value: number }>;
};

export function TrendChart({ series }: { series: TrendSeries[] }) {
  const dateMap = new Map<string, Record<string, string | number>>();

  for (const item of series) {
    for (const point of item.dataPoints) {
      const key = new Date(point.date).toLocaleDateString();
      const row = dateMap.get(key) ?? { name: key };
      row[item.label] = point.value;
      dateMap.set(key, row);
    }
  }

  const chartData = Array.from(dateMap.values());

  if (!chartData.length) {
    return <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">No trend data available yet.</div>;
  }

  return (
    <div className="h-[320px] w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-halo">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip />
          <Legend />
          {series.map((item, index) => (
            <Line key={item.label} type="monotone" dataKey={item.label} stroke={['#0f87d9', '#14b8a6', '#f59e0b', '#ef4444'][index % 4]} strokeWidth={3} dot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
