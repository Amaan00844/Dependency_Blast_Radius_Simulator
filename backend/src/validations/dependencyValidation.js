const { z } = require('zod');

const createDependencySchema = z.object({
  body: z.object({
    fromServiceId: z.string().min(1, 'fromServiceId is required'),
    toServiceId: z.string().min(1, 'toServiceId is required'),
    type: z.enum(['sync', 'async', 'database', 'event', 'other']).optional(),
    isCritical: z.boolean().optional(),
    latencySensitivity: z.enum(['high', 'medium', 'low']).optional(),
  }),
});

module.exports = {
  createDependencySchema,
};
