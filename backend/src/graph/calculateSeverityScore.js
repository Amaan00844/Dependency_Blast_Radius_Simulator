const calculateSeverityScore = (criticality, depth, isCriticalEdge) => {
  // serviceImpactScore = criticalityWeight * dependencyWeight * depthDecay
  const criticalityWeight = criticality / 5;
  const dependencyWeight = isCriticalEdge ? 1.0 : 0.7;
  // Make sure depth starts at 1 for calculation to avoid 1/0
  // Actually, depth in BFS starts at 1 for direct impacted
  const depthDecay = 1 / depth;

  return criticalityWeight * dependencyWeight * depthDecay;
};

module.exports = {
  calculateSeverityScore,
};
