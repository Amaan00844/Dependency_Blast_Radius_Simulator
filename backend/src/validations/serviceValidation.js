const { z } = require('zod');

const createServiceSchema = z.object({
  body: z.object({
    serviceId: z.string().min(1, 'Service ID is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    ownerTeam: z.string().min(1, 'Owner Team is required'),
    tier: z.enum(['1', '2', '3', '4']).optional(),
    criticality: z.number().min(1).max(5).optional(),
    status: z.enum(['healthy', 'degraded', 'failed']).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateServiceSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    ownerTeam: z.string().optional(),
    tier: z.enum(['1', '2', '3', '4']).optional(),
    criticality: z.number().min(1).max(5).optional(),
    status: z.enum(['healthy', 'degraded', 'failed']).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

module.exports = {
  createServiceSchema,
  updateServiceSchema,
};
