'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType, addEdge, Connection, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { fetchDependencies, fetchServices, createDependency } from '@/lib/api';
import CustomNode from '@/components/CustomNode';

const nodeTypes = {
  customNode: CustomNode,
};

export default function GraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);

  const loadGraphData = async () => {
    try {
      setLoading(true);
      const [deps, svcs] = await Promise.all([fetchDependencies(), fetchServices()]);
      
      // Basic automatic layout using simple grid for demo, normally dagre or elkjs is used
      const newNodes = svcs.map((svc: any, idx: number) => {
        const col = idx % 4;
        const row = Math.floor(idx / 4);
        return {
          id: svc.serviceId,
          type: 'customNode',
          position: { x: col * 250 + 50, y: row * 150 + 50 },
          data: { ...svc },
        };
      });

      const newEdges = deps.map((dep: any) => ({
        id: `${dep.fromServiceId}-${dep.toServiceId}`,
        source: dep.fromServiceId,
        target: dep.toServiceId,
        animated: dep.type === 'async' || dep.type === 'event',
        label: dep.type,
        style: { stroke: dep.isCritical ? '#f43f5e' : '#94a3b8', strokeWidth: dep.isCritical ? 2 : 1 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: dep.isCritical ? '#f43f5e' : '#94a3b8',
        },
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraphData();
  }, []);

  const onConnect = useCallback(async (params: Connection) => {
    if (params.source === params.target) {
      alert("A service cannot depend on itself");
      return;
    }
    
    try {
      // Create dependency in backend
      await createDependency({
        fromServiceId: params.source,
        toServiceId: params.target,
        type: 'sync',
        isCritical: true,
        latencySensitivity: 'medium'
      });
      
      // Optimistically add the edge to the UI so it connects instantly
      setEdges((eds) => addEdge({
        ...params, 
        id: `${params.source}-${params.target}`,
        label: 'sync',
        style: { stroke: '#f43f5e', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' }
      }, eds));
      
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create dependency');
    }
  }, [setEdges]);

  if (loading) return <div className="flex h-full items-center justify-center">Loading graph...</div>;

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Graph Visualization</h1>
        <p className="text-sm text-slate-500">Drag nodes to reorganize. Drag from Bottom dot to Top dot to create dependency.</p>
      </div>
      
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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
