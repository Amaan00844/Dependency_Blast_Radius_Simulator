const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const validate = require('../middlewares/validate');
const { runSimulationSchema } = require('../validations/simulationValidation');

router.post('/run', validate(runSimulationSchema), simulationController.runSimulation);
router.get('/', simulationController.getSimulations);
router.get('/:simulationId', simulationController.getSimulationById);

module.exports = router;
