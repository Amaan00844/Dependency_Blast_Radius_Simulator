# Dependency Blast Radius Simulator

A modern full-stack web application designed to help engineering teams model distributed services, define dependencies, visualize the dependency graph, and simulate service failures to compute the blast radius.

## Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide React, React Flow (for graph visualization)
- **Backend:** Node.js, Express, JavaScript, Zod (Validation), Mongoose
- **Database:** MongoDB (via Mongoose)
- **Architecture:** Layered REST API (Controllers, Services, Repositories)

## Features
1. **Service Management:** Add, list, and delete microservices with details like ownership, tier, and criticality.
2. **Dependency Management:** Define dependencies between services. Prevents circular dependencies automatically.
3. **Graph Visualization:** Interactive visualization of the entire system architecture using React Flow.
4. **Blast Radius Simulation:** Simulate the failure of one or more services to observe cascading impact across the dependency chain. 
5. **Severity Scoring:** A calculated severity score based on depth of impact and the criticality of the services affected.
6. **Simulation History:** Track and revisit historical simulations.

## Project Structure
The project is strictly divided into `frontend/` and `backend/`.

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. There is a `.env` file included with default local values.
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/DBRS
   NODE_ENV=development
   ```
4. Run the seed script to populate the database with realistic sample data:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

## Assumptions & Trade-offs
- **Authentication:** Omitted to focus on core logic, as per instructions.
- **Graph Layout:** Used a simplified layout generation logic for React Flow. In a massive enterprise system, a layout engine like `dagre` would be used.
- **Real-time:** Updates are perceived as real-time through immediate state updates upon API responses without page refreshes.

## Running Tests
To run backend unit tests (e.g. for the graph algorithms):
```bash
cd backend
npm test
```
