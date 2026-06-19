const serviceService = require('../services/serviceService');
const asyncHandler = require('../middlewares/asyncHandler');

const createService = asyncHandler(async (req, res) => {
  try {
    const service = await serviceService.createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400);
    throw error;
  }
});

const getServices = asyncHandler(async (req, res) => {
  const services = await serviceService.getAllServices();
  res.status(200).json(services);
});

const getServiceById = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.serviceId);
  res.status(200).json(service);
});

const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(req.params.serviceId, req.body);
  res.status(200).json(service);
});

const deleteService = asyncHandler(async (req, res) => {
  await serviceService.deleteService(req.params.serviceId);
  res.status(200).json({ message: 'Service deleted successfully' });
});

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
