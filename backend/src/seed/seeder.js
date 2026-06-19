require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Dependency = require('../models/Dependency');
const Simulation = require('../models/Simulation');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Service.deleteMany({});
    await Dependency.deleteMany({});
    await Simulation.deleteMany({});

    console.log('Seeding Services...');
    const services = [
      { serviceId: 'api-gateway', name: 'API Gateway', description: 'Main entry point for all requests', ownerTeam: 'Platform', tier: '1', criticality: 5, status: 'healthy', tags: ['edge', 'routing'] },
      { serviceId: 'auth-service', name: 'Auth Service', description: 'Handles authentication and authorization', ownerTeam: 'Security', tier: '1', criticality: 5, status: 'healthy', tags: ['security', 'core'] },
      { serviceId: 'user-service', name: 'User Service', description: 'Manages user profiles and accounts', ownerTeam: 'Core', tier: '2', criticality: 4, status: 'healthy', tags: ['core', 'data'] },
      { serviceId: 'billing-service', name: 'Billing Service', description: 'Processes payments and subscriptions', ownerTeam: 'Finance', tier: '1', criticality: 5, status: 'healthy', tags: ['finance', 'payments'] },
      { serviceId: 'notification-service', name: 'Notification Service', description: 'Sends emails and SMS', ownerTeam: 'Platform', tier: '3', criticality: 2, status: 'healthy', tags: ['comms'] },
      { serviceId: 'inventory-service', name: 'Inventory Service', description: 'Tracks product stock levels', ownerTeam: 'Supply Chain', tier: '2', criticality: 3, status: 'healthy', tags: ['ecommerce'] },
      { serviceId: 'search-service', name: 'Search Service', description: 'Provides full-text search', ownerTeam: 'Search', tier: '2', criticality: 3, status: 'healthy', tags: ['search', 'elasticsearch'] },
      { serviceId: 'recommendation-service', name: 'Recommendation Service', description: 'Generates product recommendations', ownerTeam: 'Data Science', tier: '3', criticality: 2, status: 'healthy', tags: ['ml', 'data'] },
      { serviceId: 'db-proxy', name: 'Database Proxy', description: 'Routes connection to main datastore', ownerTeam: 'Data Eng', tier: '1', criticality: 5, status: 'healthy', tags: ['infrastructure', 'database'] },
      { serviceId: 'cache-layer', name: 'Cache Layer', description: 'Distributed Redis cache', ownerTeam: 'Platform', tier: '1', criticality: 4, status: 'healthy', tags: ['infrastructure', 'redis'] },
    ];

    await Service.insertMany(services);

    console.log('Seeding Dependencies...');
    const dependencies = [
      // API Gateway depends on many
      { fromServiceId: 'api-gateway', toServiceId: 'auth-service', type: 'sync', isCritical: true, latencySensitivity: 'high' },
      { fromServiceId: 'api-gateway', toServiceId: 'user-service', type: 'sync', isCritical: true, latencySensitivity: 'high' },
      { fromServiceId: 'api-gateway', toServiceId: 'billing-service', type: 'sync', isCritical: true, latencySensitivity: 'high' },
      { fromServiceId: 'api-gateway', toServiceId: 'inventory-service', type: 'sync', isCritical: true, latencySensitivity: 'medium' },
      { fromServiceId: 'api-gateway', toServiceId: 'search-service', type: 'sync', isCritical: false, latencySensitivity: 'medium' },
      { fromServiceId: 'api-gateway', toServiceId: 'recommendation-service', type: 'sync', isCritical: false, latencySensitivity: 'low' },

      // Auth Service
      { fromServiceId: 'auth-service', toServiceId: 'db-proxy', type: 'database', isCritical: true, latencySensitivity: 'high' },
      { fromServiceId: 'auth-service', toServiceId: 'cache-layer', type: 'sync', isCritical: false, latencySensitivity: 'high' },

      // User Service
      { fromServiceId: 'user-service', toServiceId: 'db-proxy', type: 'database', isCritical: true, latencySensitivity: 'high' },

      // Billing Service
      { fromServiceId: 'billing-service', toServiceId: 'user-service', type: 'sync', isCritical: true, latencySensitivity: 'medium' },
      { fromServiceId: 'billing-service', toServiceId: 'notification-service', type: 'event', isCritical: false, latencySensitivity: 'low' },
      { fromServiceId: 'billing-service', toServiceId: 'db-proxy', type: 'database', isCritical: true, latencySensitivity: 'high' },

      // Inventory Service
      { fromServiceId: 'inventory-service', toServiceId: 'db-proxy', type: 'database', isCritical: true, latencySensitivity: 'high' },

      // Search Service
      { fromServiceId: 'search-service', toServiceId: 'db-proxy', type: 'database', isCritical: true, latencySensitivity: 'medium' },
      { fromServiceId: 'search-service', toServiceId: 'cache-layer', type: 'sync', isCritical: true, latencySensitivity: 'high' },

      // Recommendation Service
      { fromServiceId: 'recommendation-service', toServiceId: 'user-service', type: 'sync', isCritical: true, latencySensitivity: 'low' },
      { fromServiceId: 'recommendation-service', toServiceId: 'search-service', type: 'sync', isCritical: false, latencySensitivity: 'low' },
      { fromServiceId: 'recommendation-service', toServiceId: 'db-proxy', type: 'database', isCritical: true, latencySensitivity: 'low' },
    ];

    await Dependency.insertMany(dependencies);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
