import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const fetchDashboardSummary = async () => {
  const res = await api.get('/dashboard/summary');
  return res.data;
};

export const fetchServices = async () => {
  const res = await api.get('/services');
  return res.data;
};

export const createService = async (data: any) => {
  const res = await api.post('/services', data);
  return res.data;
};

export const deleteService = async (serviceId: string) => {
  const res = await api.delete(`/services/${serviceId}`);
  return res.data;
};

export const fetchDependencies = async () => {
  const res = await api.get('/dependencies');
  return res.data;
};

export const createDependency = async (data: any) => {
  const res = await api.post('/dependencies', data);
  return res.data;
};

export const deleteDependency = async (dependencyId: string) => {
  const res = await api.delete(`/dependencies/${dependencyId}`);
  return res.data;
};

export const runSimulation = async (failedServiceIds: string[]) => {
  const res = await api.post('/simulations/run', { failedServiceIds });
  return res.data;
};

export const fetchSimulations = async () => {
  const res = await api.get('/simulations');
  return res.data;
};

export const fetchSimulationById = async (id: string) => {
  const res = await api.get(`/simulations/${id}`);
  return res.data;
};

export default api;
