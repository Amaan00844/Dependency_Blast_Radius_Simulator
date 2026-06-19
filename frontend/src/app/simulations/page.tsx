'use client';

import { useEffect, useState } from 'react';
import { fetchSimulations, fetchServices, runSimulation } from '@/lib/api';
import Link from 'next/link';
import { History, Play, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SimulationsPage() {
  const router = useRouter();
  const [simulations, setSimulations] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedService, setSelectedService] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sims, svcs] = await Promise.all([fetchSimulations(), fetchServices()]);
      setSimulations(sims);
      setServices(svcs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    
    setIsSimulating(true);
    try {
      const res = await runSimulation([selectedService]);
      const id = res?.simulationId || res?._id || res?.data?.simulationId;
      if (!id) {
        alert('Missing simulation ID in response. Check console.');
        console.error('Simulation Response:', res);
        setIsSimulating(false);
        return;
      }
      router.push(`/simulations/${id}`);
    } catch (err) {
      alert('Simulation failed to run');
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <History className="text-blue-600" />
          Simulations
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
          <Play className="w-5 h-5 text-indigo-600" />
          Run New Simulation
        </h2>
        <form onSubmit={handleRunSimulation} className="flex gap-4 items-end">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Service to Fail</label>
            <select 
              required 
              value={selectedService} 
              onChange={e => setSelectedService(e.target.value)} 
              className="w-full p-2 border border-slate-300 rounded-md"
            >
              <option value="">Select Service...</option>
              {services.map(s => <option key={s.serviceId} value={s.serviceId}>{s.name} ({s.serviceId})</option>)}
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isSimulating || !selectedService}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSimulating ? 'Running...' : 'Run Simulation'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-800">Simulation History</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading history...</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Simulation ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Summary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {simulations.map((sim) => (
                <tr key={sim._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(sim.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {sim.simulationId}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {sim.summary}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-bold">
                      {sim.totalSeverityScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/simulations/${sim.simulationId}`} className="text-blue-600 hover:text-blue-900 font-semibold">
                      View Details &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
              {simulations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No simulations run yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
