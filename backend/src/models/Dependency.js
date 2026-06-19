const mongoose = require('mongoose');

const dependencySchema = new mongoose.Schema(
  {
    fromServiceId: {
      type: String,
      required: true,
      index: true,
    },
    toServiceId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['sync', 'async', 'database', 'event', 'other'],
      default: 'sync',
    },
    isCritical: {
      type: Boolean,
      default: true,
    },
    latencySensitivity: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure no duplicate dependencies
dependencySchema.index({ fromServiceId: 1, toServiceId: 1 }, { unique: true });

const Dependency = mongoose.model('Dependency', dependencySchema);
module.exports = Dependency;
