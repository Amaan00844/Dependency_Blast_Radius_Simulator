// Checks if there is a path from `startNode` to `targetNode`
const detectCircularDependency = (adjMap, startNode, targetNode) => {
  const visited = new Set();
  const queue = [startNode];

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === targetNode) {
      return true; // Path found, cycle exists
    }

    visited.add(current);

    const neighbors = adjMap.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }

  return false;
};

module.exports = {
  detectCircularDependency,
};
