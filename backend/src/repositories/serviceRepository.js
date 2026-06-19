const Service = require('../models/Service');

class ServiceRepository {
  async create(data) {
    const service = new Service(data);
    return await service.save();
  }

  async findAll() {
    return await Service.find({});
  }

  async findById(serviceId) {
    return await Service.findOne({ serviceId });
  }

  async update(serviceId, data) {
    return await Service.findOneAndUpdate({ serviceId }, data, { new: true });
  }

  async delete(serviceId) {
    return await Service.findOneAndDelete({ serviceId });
  }

  async count() {
    return await Service.countDocuments();
  }
}

module.exports = new ServiceRepository();
