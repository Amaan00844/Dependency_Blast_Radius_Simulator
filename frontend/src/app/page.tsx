'use client';

import { useEffect, useState } from 'react';
import { fetchDashboardSummary } from '@/lib/api';
import { Activity, Component, Network, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardSummary()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="text-red-500">Failed to load dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Services"
          value={data.totalServices}
          icon={<Component className="w-6 h-6 text-blue-500" />}
        />
        <StatCard
          title="Total Dependencies"
          value={data.totalDependencies}
          icon={<Network className="w-6 h-6 text-indigo-500" />}
        />
        <StatCard
          title="Healthy Services"
          value={data.statusCounts.healthy}
          icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}
        />
        <StatCard
          title="Degraded/Failed"
          value={data.statusCounts.degraded + data.statusCounts.failed}
          icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Criticality Services */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            Highly Critical Services
          </h2>
          <div className="space-y-3">
            {data.highCriticalityServices.length === 0 ? (
              <p className="text-sm text-slate-500">No highly critical services found.</p>
            ) : (
              data.highCriticalityServices.map((svc: any) => (
                <div key={svc.serviceId} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <div className="font-medium text-slate-800">{svc.name}</div>
                    <div className="text-xs text-slate-500">{svc.serviceId}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Tier {svc.tier}</span>
                    <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-medium rounded-full">Crit: {svc.criticality}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Simulations */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Simulations</h2>
          <div className="space-y-3">
            {data.recentSimulations.length === 0 ? (
              <p className="text-sm text-slate-500">No simulations run yet.</p>
            ) : (
              data.recentSimulations.map((sim: any) => (
                <Link key={sim.simulationId} href={`/simulations/${sim.simulationId}`} className="block">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer">
                    <div className="text-sm font-medium text-slate-800 mb-1">{sim.simulationId}</div>
                    <div className="text-xs text-slate-500">{sim.summary}</div>
                    <div className="mt-2 text-xs text-slate-400">
                      {new Date(sim.createdAt).toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div className="mt-4 text-right">
            <Link href="/simulations" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-lg">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-slate-500">{title}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
}
