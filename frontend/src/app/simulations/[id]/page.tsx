'use client';

import { useEffect, useState } from 'react';
import { fetchSimulationById, fetchDependencies, fetchServices } from '@/lib/api';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '@/components/CustomNode';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

const nodeTypes = {
  customNode: CustomNode,
};

import { use } from 'react';

export default function SimulationDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [simulation, setSimulation] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sim, deps, svcs] = await Promise.all([
          fetchSimulationById(params.id),
          fetchDependencies(),
          fetchServices(),
        ]);
        
        setSimulation(sim);

        // Map impacted services for quick lookup
        const impactMap = new Map();
        sim.impactedServices.forEach((is: any) => {
          impactMap.set(is.serviceId, is.impactType);
        });

        const newNodes = svcs.map((svc: any, idx: number) => {
          let simulationState = null;
          if (sim.failedServiceIds.includes(svc.serviceId)) {
            simulationState = 'failed';
          } else if (impactMap.has(svc.serviceId)) {
            simulationState = impactMap.get(svc.serviceId);
          }

          const col = idx % 4;
          const row = Math.floor(idx / 4);

          return {
            id: svc.serviceId,
            type: 'customNode',
            position: { x: col * 250 + 50, y: row * 150 + 50 },
            data: { ...svc, simulationState },
          };
        });

        // Highlight edges that are part of the impact path
        const impactPaths = new Set();
        sim.impactedServices.forEach((is: any) => {
          // path is an array of serviceIds like ['A', 'B', 'C']
          // meaning A -> B -> C
          // So edges are A->B and B->C in reverse map, but forward it's C depends on B depends on A
          for (let i = 0; i < is.path.length - 1; i++) {
            // forward dependency: path[i+1] -> path[i]
            impactPaths.add(`${is.path[i+1]}-${is.path[i]}`);
          }
        });

        const newEdges = deps.map((dep: any) => {
          const edgeId = `${dep.fromServiceId}-${dep.toServiceId}`;
          const isImpactPath = impactPaths.has(edgeId);

          return {
            id: edgeId,
            source: dep.fromServiceId,
            target: dep.toServiceId,
            animated: isImpactPath, // animate the failure cascade
            style: { 
              stroke: isImpactPath ? '#f43f5e' : (dep.isCritical ? '#94a3b8' : '#cbd5e1'), 
              strokeWidth: isImpactPath ? 3 : (dep.isCritical ? 2 : 1) 
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isImpactPath ? '#f43f5e' : (dep.isCritical ? '#94a3b8' : '#cbd5e1'),
            },
          };
        });

        setNodes(newNodes);
        setEdges(newEdges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id, setNodes, setEdges]);

  if (loading) return <div className="flex h-full items-center justify-center">Loading simulation details...</div>;
  if (!simulation) return <div className="text-red-500">Failed to load simulation.</div>;

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/simulations" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="text-red-600" />
            Simulation Result: {simulation.simulationId}
          </h1>
          <p className="text-sm text-slate-500">{simulation.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="text-sm text-slate-500 font-medium">Total Severity Score</div>
          <div className="text-3xl font-black text-red-600">{simulation.totalSeverityScore.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="text-sm text-slate-500 font-medium">Failed Services (Source)</div>
          <div className="text-xl font-bold text-slate-800">{simulation.failedServiceIds.join(', ')}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="text-sm text-slate-500 font-medium">Impacted Services</div>
          <div className="text-xl font-bold text-slate-800">{simulation.impactedServices.length}</div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm relative">
        <div className="absolute top-4 left-4 z-10 bg-white/90 p-3 rounded-lg border border-slate-200 shadow-sm text-xs space-y-2 pointer-events-none">
          <div className="font-bold text-slate-800 mb-2">Legend</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-100 border border-red-500 rounded"></div> Failed Source</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-100 border border-orange-500 rounded"></div> Direct Impact</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-100 border border-amber-500 rounded"></div> Indirect Impact</div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
            <div className="w-4 h-[2px] bg-red-500"></div> Impact Path
          </div>
        </div>
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#e2e8f0" gap={16} />
          <Controls />
          <MiniMap zoomable pannable nodeClassName={(n) => 'fill-blue-500'} />
        </ReactFlow>
      </div>
    </div>
  );
}
