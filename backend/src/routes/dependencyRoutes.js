const express = require('express');
const router = express.Router();
const dependencyController = require('../controllers/dependencyController');
const validate = require('../middlewares/validate');
const { createDependencySchema } = require('../validations/dependencyValidation');

router.route('/')
  .post(validate(createDependencySchema), dependencyController.createDependency)
  .get(dependencyController.getDependencies);

router.route('/:dependencyId')
  .delete(dependencyController.deleteDependency);

module.exports = router;
