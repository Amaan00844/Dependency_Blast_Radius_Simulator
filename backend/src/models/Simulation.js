const mongoose = require('mongoose');

const impactedServiceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: true,
    },
    impactType: {
      type: String,
      enum: ['direct', 'indirect'],
      required: true,
    },
    depth: {
      type: Number,
      required: true,
    },
    severityScore: {
      type: Number,
      required: true,
    },
    path: [
      {
        type: String, // Array of serviceIds representing the path from failed to this service
      },
    ],
  },
  { _id: false }
);

const simulationSchema = new mongoose.Schema(
  {
    simulationId: {
      type: String,
      required: true,
      unique: true,
    },
    failedServiceIds: [
      {
        type: String,
        required: true,
      },
    ],
    impactedServices: [impactedServiceSchema],
    totalSeverityScore: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
    },
    createdBy: {
      type: String,
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

const Simulation = mongoose.model('Simulation', simulationSchema);
module.exports = Simulation;
