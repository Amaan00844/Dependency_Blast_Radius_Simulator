const Simulation = require('../models/Simulation');

class SimulationRepository {
  async create(data) {
    const simulation = new Simulation(data);
    return await simulation.save();
  }

  async findAll() {
    return await Simulation.find({}).sort({ createdAt: -1 });
  }

  async findById(simulationId) {
    return await Simulation.findOne({ simulationId });
  }

  async getRecent(limit = 5) {
    return await Simulation.find({}).sort({ createdAt: -1 }).limit(limit);
  }
}

module.exports = new SimulationRepository();
