const dependencyService = require('../services/dependencyService');
const asyncHandler = require('../middlewares/asyncHandler');

const createDependency = asyncHandler(async (req, res) => {
  try {
    const dependency = await dependencyService.createDependency(req.body);
    res.status(201).json(dependency);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

const getDependencies = asyncHandler(async (req, res) => {
  const dependencies = await dependencyService.getAllDependencies();
  res.status(200).json(dependencies);
});

const deleteDependency = asyncHandler(async (req, res) => {
  await dependencyService.deleteDependency(req.params.dependencyId);
  res.status(200).json({ message: 'Dependency deleted successfully' });
});

module.exports = {
  createDependency,
  getDependencies,
  deleteDependency,
};
