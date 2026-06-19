const simulationRepository = require('../repositories/simulationRepository');
const serviceRepository = require('../repositories/serviceRepository');
const dependencyRepository = require('../repositories/dependencyRepository');
const { computeBlastRadius } = require('../graph/computeBlastRadius');

class SimulationService {
  async runSimulation(failedServiceIds) {
    if (!failedServiceIds || failedServiceIds.length === 0) {
      throw new Error('At least one failed service is required');
    }

    const services = await serviceRepository.findAll();
    const dependencies = await dependencyRepository.findAll();

    // Generate simulation result
    const { impactedServices, totalSeverityScore } = computeBlastRadius(
      failedServiceIds,
      services,
      dependencies
    );

    const simulationId = `sim-${Date.now()}`;
    const summary = `${failedServiceIds.length} failed service(s) resulted in ${impactedServices.length} impacted service(s) with a total severity score of ${totalSeverityScore.toFixed(2)}`;

    const simulationData = {
      simulationId,
      failedServiceIds,
      impactedServices,
      totalSeverityScore,
      summary,
    };

    return await simulationRepository.create(simulationData);
  }

  async getAllSimulations() {
    return await simulationRepository.findAll();
  }

  async getSimulationById(simulationId) {
    const simulation = await simulationRepository.findById(simulationId);
    if (!simulation) {
      throw new Error(`Simulation with ID ${simulationId} not found`);
    }
    return simulation;
  }
}

module.exports = new SimulationService();
