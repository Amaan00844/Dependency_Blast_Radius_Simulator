const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const validate = require('../middlewares/validate');
const { createServiceSchema, updateServiceSchema } = require('../validations/serviceValidation');

router.route('/')
  .post(validate(createServiceSchema), serviceController.createService)
  .get(serviceController.getServices);

router.route('/:serviceId')
  .get(serviceController.getServiceById)
  .patch(validate(updateServiceSchema), serviceController.updateService)
  .delete(serviceController.deleteService);

module.exports = router;
