const serviceRepository = require('../repositories/serviceRepository');
const dependencyRepository = require('../repositories/dependencyRepository');

class ServiceService {
  async createService(data) {
    const existing = await serviceRepository.findById(data.serviceId);
    if (existing) {
      throw new Error(`Service with ID ${data.serviceId} already exists`);
    }
    return await serviceRepository.create(data);
  }

  async getAllServices() {
    return await serviceRepository.findAll();
  }

  async getServiceById(serviceId) {
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new Error(`Service with ID ${serviceId} not found`);
    }
    return service;
  }

  async updateService(serviceId, data) {
    const service = await serviceRepository.update(serviceId, data);
    if (!service) {
      throw new Error(`Service with ID ${serviceId} not found`);
    }
    return service;
  }

  async deleteService(serviceId) {
    // Delete service
    const deleted = await serviceRepository.delete(serviceId);
    if (!deleted) {
      throw new Error(`Service with ID ${serviceId} not found`);
    }
    // Delete all related dependencies
    await dependencyRepository.deleteByServiceId(serviceId);
    return deleted;
  }
}

module.exports = new ServiceService();
