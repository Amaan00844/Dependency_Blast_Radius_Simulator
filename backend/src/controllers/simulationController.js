const simulationService = require('../services/simulationService');
const asyncHandler = require('../middlewares/asyncHandler');

const runSimulation = asyncHandler(async (req, res) => {
  const simulation = await simulationService.runSimulation(req.body.failedServiceIds);
  res.status(201).json(simulation);
});

const getSimulations = asyncHandler(async (req, res) => {
  const simulations = await simulationService.getAllSimulations();
  res.status(200).json(simulations);
});

const getSimulationById = asyncHandler(async (req, res) => {
  const simulation = await simulationService.getSimulationById(req.params.simulationId);
  res.status(200).json(simulation);
});

module.exports = {
  runSimulation,
  getSimulations,
  getSimulationById,
};
