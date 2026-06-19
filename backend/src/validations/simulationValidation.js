const { z } = require('zod');

const runSimulationSchema = z.object({
  body: z.object({
    failedServiceIds: z.array(z.string()).min(1, 'At least one failed service must be provided'),
  }),
});

module.exports = {
  runSimulationSchema,
};
