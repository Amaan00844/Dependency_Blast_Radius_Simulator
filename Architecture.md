# Architecture Document

## Problem Statement
Modern distributed systems consist of numerous interconnected services. When one service fails, the failure can cascade, leading to widespread outages. Identifying the "blast radius" of a failure is critical for incident response and system resilience planning.

## System Design
The application is separated into a frontend Next.js App Router application and a backend Node.js Express API, communicating via REST.

### Backend Layered Architecture
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain core business rules (e.g. validating that a service doesn't depend on itself).
- **Repositories:** Abstract MongoDB database operations using Mongoose.
- **Graph:** Isolated utility functions that perform algorithmic calculations on the system graph.

## Data Model
1. **Service:** Represents a microservice (e.g., API Gateway, Auth Service).
2. **Dependency:** Represents an edge in the graph. `fromServiceId` depends on `toServiceId`.
3. **Simulation:** Records the outcome of a failure simulation, including impacted services, calculated severity, and the paths of impact.

## Graph Semantics
- **Direction:** `A -> B` means `A` depends on `B`.
- **Failure Propagation:** If `B` fails, `A` is impacted. Therefore, blast radius is calculated by traversing the *reverse* dependency graph.

## Simulation Engine Design
The simulation engine uses Breadth-First Search (BFS).
1. We construct a **reverse adjacency map** from the existing dependencies.
2. We initialize a queue with the `failedServiceIds`.
3. For each neighbor in the reverse map, if it hasn't been visited, we add it to the queue and calculate its depth, path, and severity score.
4. Circular dependencies are prevented at creation time using a similar BFS traversal, ensuring the graph remains a Directed Acyclic Graph (DAG).

## Severity Scoring
The severity score for each impacted service is calculated using the formula:
`serviceImpactScore = criticalityWeight * dependencyWeight * depthDecay`
Where:
- `criticalityWeight` = Service Criticality (1-5) / 5
- `dependencyWeight` = 1.0 if the dependency is marked as critical, else 0.7
- `depthDecay` = 1 / depth (Direct impact = 1, Indirect = 0.5, 0.33, etc.)

## Scalability Considerations
- **Graph Traversals:** Currently performed in-memory on the Node.js server. For massive graphs (10,000+ nodes), this could be migrated to a graph database (like Neo4j) which natively supports optimized traversals.
- **Stateless Backend:** The Express backend is stateless and can be scaled horizontally.

## Failure Handling
- **Database Failures:** Handled gracefully via custom async error wrapping middlewares in Express.
- **Frontend Fallbacks:** Empty states and loading indicators are provided across the UI to ensure a robust user experience if the API is slow or unavailable.
