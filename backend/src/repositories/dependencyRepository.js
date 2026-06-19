const Dependency = require('../models/Dependency');

class DependencyRepository {
  async create(data) {
    const dependency = new Dependency(data);
    return await dependency.save();
  }

  async findAll() {
    return await Dependency.find({});
  }

  async delete(id) {
    return await Dependency.findByIdAndDelete(id);
  }

  async deleteByServiceId(serviceId) {
    return await Dependency.deleteMany({
      $or: [{ fromServiceId: serviceId }, { toServiceId: serviceId }],
    });
  }

  async count() {
    return await Dependency.countDocuments();
  }
}

module.exports = new DependencyRepository();
