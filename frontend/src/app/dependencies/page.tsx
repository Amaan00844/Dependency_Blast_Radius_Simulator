'use client';

import { useEffect, useState } from 'react';
import { fetchDependencies, fetchServices, createDependency, deleteDependency } from '@/lib/api';
import { Trash2, Plus, Network, RefreshCw } from 'lucide-react';

export default function DependenciesPage() {
  const [dependencies, setDependencies] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    fromServiceId: '',
    toServiceId: '',
    type: 'sync',
    isCritical: true,
    latencySensitivity: 'medium',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [deps, svcs] = await Promise.all([fetchDependencies(), fetchServices()]);
      setDependencies(deps);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fromServiceId === formData.toServiceId) {
      alert("A service cannot depend on itself");
      return;
    }
    try {
      await createDependency(formData);
      setShowForm(false);
      setFormData({ fromServiceId: '', toServiceId: '', type: 'sync', isCritical: true, latencySensitivity: 'medium' });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create dependency');
    }
  };

  const handleDelete = async (dependencyId: string) => {
    if (!confirm('Are you sure you want to delete this dependency?')) return;
    try {
      await deleteDependency(dependencyId);
      loadData();
    } catch (err) {
      alert('Failed to delete dependency');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Network className="text-blue-600" />
          Dependencies
        </h1>
        <div className="flex gap-2">
          <button onClick={loadData} className="p-2 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Dependency
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Add New Dependency</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">From Service (Depends on)</label>
              <select required value={formData.fromServiceId} onChange={e => setFormData({...formData, fromServiceId: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md">
                <option value="">Select Service...</option>
                {services.map(s => <option key={s.serviceId} value={s.serviceId}>{s.name} ({s.serviceId})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">To Service (Is Needed By)</label>
              <select required value={formData.toServiceId} onChange={e => setFormData({...formData, toServiceId: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md">
                <option value="">Select Service...</option>
                {services.map(s => <option key={s.serviceId} value={s.serviceId}>{s.name} ({s.serviceId})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md">
                <option value="sync">Synchronous (API)</option>
                <option value="async">Asynchronous</option>
                <option value="database">Database</option>
                <option value="event">Event Stream</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Criticality</label>
              <div className="flex items-center h-10 gap-2">
                <input type="checkbox" id="isCritical" checked={formData.isCritical} onChange={e => setFormData({...formData, isCritical: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <label htmlFor="isCritical" className="text-sm text-slate-700">Hard Dependency (Critical)</label>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Dependency</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-slate-500">Loading dependencies...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">From (Depends On)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">To (Needed By)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Critical</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {dependencies.map((dep) => (
                <tr key={dep._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{dep.fromServiceId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{dep.toServiceId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 capitalize">{dep.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dep.isCritical ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(dep._id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {dependencies.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No dependencies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
