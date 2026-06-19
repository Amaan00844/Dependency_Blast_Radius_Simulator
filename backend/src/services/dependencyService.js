const dependencyRepository = require('../repositories/dependencyRepository');
const serviceRepository = require('../repositories/serviceRepository');
// Graph util for circular dependency will be implemented in Step 10
const { detectCircularDependency } = require('../graph/detectCircularDependency');
const { buildAdjacencyMap } = require('../graph/buildAdjacencyMap');

class DependencyService {
  async createDependency(data) {
    if (data.fromServiceId === data.toServiceId) {
      throw new Error('A service cannot depend on itself');
    }

    // Ensure both services exist
    const fromService = await serviceRepository.findById(data.fromServiceId);
    const toService = await serviceRepository.findById(data.toServiceId);

    if (!fromService || !toService) {
      throw new Error('Both services must exist to create a dependency');
    }

    // Get all current dependencies to check for circularity
    const allDependencies = await dependencyRepository.findAll();
    const adjMap = buildAdjacencyMap(allDependencies);

    // If we add an edge from -> to, does it create a cycle?
    // In our model, A depends on B. So edge is A -> B.
    // If we can reach A from B, then adding A -> B creates a cycle.
    if (detectCircularDependency(adjMap, data.toServiceId, data.fromServiceId)) {
      throw new Error('Cannot create dependency: Circular dependency detected');
    }

    try {
      return await dependencyRepository.create(data);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Dependency already exists');
      }
      throw error;
    }
  }

  async getAllDependencies() {
    return await dependencyRepository.findAll();
  }

  async deleteDependency(id) {
    const deleted = await dependencyRepository.delete(id);
    if (!deleted) {
      throw new Error(`Dependency not found`);
    }
    return deleted;
  }
}

module.exports = new DependencyService();
