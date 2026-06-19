// Build forward adjacency map: A depends on B
const buildAdjacencyMap = (dependencies) => {
  const map = new Map();
  dependencies.forEach((dep) => {
    if (!map.has(dep.fromServiceId)) {
      map.set(dep.fromServiceId, []);
    }
    map.get(dep.fromServiceId).push(dep.toServiceId);
  });
  return map;
};

// Build reverse adjacency map: B is depended on by A
// Includes full dependency object for weight calculation
const buildReverseAdjacencyMap = (dependencies) => {
  const map = new Map();
  dependencies.forEach((dep) => {
    if (!map.has(dep.toServiceId)) {
      map.set(dep.toServiceId, []);
    }
    map.get(dep.toServiceId).push({
      serviceId: dep.fromServiceId,
      isCritical: dep.isCritical,
    });
  });
  return map;
};

module.exports = {
  buildAdjacencyMap,
  buildReverseAdjacencyMap,
};
