const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ownerTeam: {
      type: String,
      required: true,
    },
    tier: {
      type: String,
      enum: ['1', '2', '3', '4'],
      default: '3',
    },
    criticality: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    status: {
      type: String,
      enum: ['healthy', 'degraded', 'failed'],
      default: 'healthy',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
