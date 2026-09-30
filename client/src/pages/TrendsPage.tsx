import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, SectionHeading } from '../components/ui';
import { TrendChart } from '../components/TrendChart';

export function TrendsPage() {
  const { user } = useAuth();
  const [trends, setTrends] = useState<any[]>([]);

  useEffect(() => {
    if (!user?._id) return;
    api.get(`/health-trends/${user._id}`).then((response) => setTrends(response.data));
  }, [user]);

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading title="Previous report comparison" subtitle="Shows informational trends over time for supported metrics." />
        <TrendChart series={trends.filter((trend) => trend.dataPoints?.length > 0)} />
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {trends.filter((trend) => trend.dataPoints?.length > 0).map((trend) => {
          const first = trend.dataPoints[0];
          const last = trend.dataPoints[trend.dataPoints.length - 1];
          return (
            <Card key={trend.metric}>
              <div className="text-lg font-semibold text-slate-900">{trend.label}</div>
              <div className="mt-2 text-sm text-slate-600">{first.value} {trend.unit} → {last.value} {trend.unit}</div>
              <div className="mt-1 text-sm text-slate-500">Value changed from {first.value} to {last.value} across the selected reports.</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
