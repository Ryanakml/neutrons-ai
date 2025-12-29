"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";

export const EditorLoading = () => (
  <div className="flex items-center justify-center h-full w-full">
    <p>Loading Editor...</p>
  </div>
);

export const EditorError = () => (
  <div className="flex items-center justify-center h-full w-full text-red-500">
    <p>Gagal memuat editor. Silakan refresh halaman.</p>
  </div>
);

interface WorkflowData {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
}

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data } = useSuspenseWorkflow(workflowId);
  const workflow = data as unknown as WorkflowData;

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes || []);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges || []);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect: OnConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeComponents}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={4}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <Controls />
      <MiniMap />
      <Panel position="top-right">
        <AddNodeButton />
      </Panel>
    </ReactFlow>
  );
};
