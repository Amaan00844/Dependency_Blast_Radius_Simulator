const { computeBlastRadius } = require('../../src/graph/computeBlastRadius');

describe('computeBlastRadius', () => {
  it('should compute blast radius correctly for simple chain A -> B -> C', () => {
    // A -> B means A depends on B
    const services = [
      { serviceId: 'A', criticality: 3 },
      { serviceId: 'B', criticality: 4 },
      { serviceId: 'C', criticality: 5 },
    ];
    
    const dependencies = [
      { fromServiceId: 'A', toServiceId: 'B', isCritical: true },
      { fromServiceId: 'B', toServiceId: 'C', isCritical: true },
    ];

    // If C fails, B and A should be impacted
    const result = computeBlastRadius(['C'], services, dependencies);
    
    expect(result.impactedServices).toHaveLength(2);
    
    const impactedB = result.impactedServices.find(s => s.serviceId === 'B');
    expect(impactedB).toBeDefined();
    expect(impactedB.impactType).toBe('direct');
    expect(impactedB.depth).toBe(1);
    expect(impactedB.path).toEqual(['C', 'B']);

    const impactedA = result.impactedServices.find(s => s.serviceId === 'A');
    expect(impactedA).toBeDefined();
    expect(impactedA.impactType).toBe('indirect');
    expect(impactedA.depth).toBe(2);
    expect(impactedA.path).toEqual(['C', 'B', 'A']);
  });
});
