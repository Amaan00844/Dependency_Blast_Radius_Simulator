'use client';

import { useEffect, useState } from 'react';
import { fetchServices, createService, deleteService } from '@/lib/api';
import { Trash2, Plus, Server, RefreshCw } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceId: '',
    name: '',
    ownerTeam: '',
    tier: '3',
    criticality: 3,
    status: 'healthy',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');

  const loadServices = () => {
    setLoading(true);
    fetchServices()
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createService(formData);
      setShowForm(false);
      setFormData({ serviceId: '', name: '', ownerTeam: '', tier: '3', criticality: 3, status: 'healthy' });
      loadServices();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create service');
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm(`Are you sure you want to delete ${serviceId}? This will also delete its dependencies.`)) return;
    try {
      await deleteService(serviceId);
      loadServices();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  // Derive unique owners for the filter dropdown
  const uniqueOwners = Array.from(new Set(services.map(s => s.ownerTeam))).filter(Boolean);

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.serviceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? service.status === statusFilter : true;
    const matchesOwner = ownerFilter ? service.ownerTeam === ownerFilter : true;
    return matchesSearch && matchesStatus && matchesOwner;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Server className="text-blue-600" />
          Services
        </h1>
        <div className="flex gap-2">
          <button onClick={loadServices} className="p-2 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <input 
          type="text" 
          placeholder="Search by name or ID..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border border-slate-300 rounded-md"
        />
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          className="p-2 border border-slate-300 rounded-md bg-white min-w-[150px]"
        >
          <option value="">All Statuses</option>
          <option value="healthy">Healthy</option>
          <option value="degraded">Degraded</option>
          <option value="failed">Failed</option>
        </select>
        <select 
          value={ownerFilter} 
          onChange={e => setOwnerFilter(e.target.value)}
          className="p-2 border border-slate-300 rounded-md bg-white min-w-[150px]"
        >
          <option value="">All Owners</option>
          {uniqueOwners.map(owner => (
            <option key={owner as string} value={owner as string}>{owner as React.ReactNode}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Add New Service</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Service ID</label>
              <input required value={formData.serviceId} onChange={e => setFormData({...formData, serviceId: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md" placeholder="e.g. user-service" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md" placeholder="e.g. User Service" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Owner Team</label>
              <input required value={formData.ownerTeam} onChange={e => setFormData({...formData, ownerTeam: e.target.value})} className="w-full p-2 border border-slate-300 rounded-md" placeholder="e.g. Core Team" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Criticality (1-5)</label>
              <input required type="number" min="1" max="5" value={formData.criticality} onChange={e => setFormData({...formData, criticality: e.target.value === '' ? ('' as any) : parseInt(e.target.value)})} className="w-full p-2 border border-slate-300 rounded-md" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Service</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-slate-500">Loading services...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Criticality</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredServices.map((service) => (
                <tr key={service._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{service.name}</div>
                    <div className="text-sm text-slate-500">{service.serviceId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{service.ownerTeam}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={clsx(
                      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                      service.status === 'healthy' ? "bg-green-100 text-green-800" :
                      service.status === 'degraded' ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{service.criticality}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(service.serviceId)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No services found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Quick inline helper for clsx since I imported it
import clsx from 'clsx';
