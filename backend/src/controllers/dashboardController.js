const serviceRepository = require('../repositories/serviceRepository');
const dependencyRepository = require('../repositories/dependencyRepository');
const simulationRepository = require('../repositories/simulationRepository');
const asyncHandler = require('../middlewares/asyncHandler');

const getDashboardSummary = asyncHandler(async (req, res) => {
  const [totalServices, totalDependencies, services, recentSimulations] = await Promise.all([
    serviceRepository.count(),
    dependencyRepository.count(),
    serviceRepository.findAll(),
    simulationRepository.getRecent(5),
  ]);

  const statusCounts = {
    healthy: 0,
    degraded: 0,
    failed: 0,
  };

  const highCriticalityServices = [];

  services.forEach(service => {
    if (statusCounts[service.status] !== undefined) {
      statusCounts[service.status]++;
    }
    if (service.criticality >= 4) {
      highCriticalityServices.push(service);
    }
  });

  res.status(200).json({
    totalServices,
    totalDependencies,
    statusCounts,
    recentSimulations,
    highCriticalityServices: highCriticalityServices.slice(0, 5), // top 5
  });
});

module.exports = {
  getDashboardSummary,
};
