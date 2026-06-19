const { buildReverseAdjacencyMap } = require('./buildAdjacencyMap');
const { calculateSeverityScore } = require('./calculateSeverityScore');

const computeBlastRadius = (failedServiceIds, services, dependencies) => {
  const reverseAdjMap = buildReverseAdjacencyMap(dependencies);
  
  // Create a map for quick service lookup (to get criticality)
  const serviceMap = new Map();
  services.forEach(s => serviceMap.set(s.serviceId, s));

  const impactedServicesMap = new Map(); // serviceId -> impacted details
  
  // Queue for BFS: { serviceId, depth, path, isCriticalEdge }
  const queue = [];

  failedServiceIds.forEach(id => {
    queue.push({
      serviceId: id,
      depth: 0,
      path: [id],
      isCriticalEdge: true, // Failed services themselves are the source
    });
  });

  const visited = new Set(failedServiceIds);

  while (queue.length > 0) {
    const current = queue.shift();
    const neighbors = reverseAdjMap.get(current.serviceId) || [];

    for (const neighbor of neighbors) {
      const neighborId = neighbor.serviceId;
      
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        
        const neighborService = serviceMap.get(neighborId);
        if (!neighborService) continue; // Service doesn't exist in map? Skip.

        const newDepth = current.depth + 1;
        const newPath = [...current.path, neighborId];
        
        const severityScore = calculateSeverityScore(
          neighborService.criticality,
          newDepth,
          neighbor.isCritical
        );

        impactedServicesMap.set(neighborId, {
          serviceId: neighborId,
          impactType: newDepth === 1 ? 'direct' : 'indirect',
          depth: newDepth,
          severityScore,
          path: newPath,
        });

        queue.push({
          serviceId: neighborId,
          depth: newDepth,
          path: newPath,
          isCriticalEdge: neighbor.isCritical,
        });
      }
    }
  }

  const impactedServices = Array.from(impactedServicesMap.values());
  const totalSeverityScore = impactedServices.reduce((sum, s) => sum + s.severityScore, 0);

  return {
    impactedServices,
    totalSeverityScore,
  };
};

module.exports = {
  computeBlastRadius,
};
