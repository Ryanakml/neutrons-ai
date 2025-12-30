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
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { AlertCircle, Loader2 } from "lucide-react";

export const EditorLoading = () => (
  <div className="flex flex-col items-center justify-center h-full w-full gap-3 bg-background/50 backdrop-blur-sm">
    <Loader2 className="size-8 animate-spin text-primary" />

    <div className="flex flex-col items-center gap-1">
      <p className="text-sm font-medium text-foreground">
        Preparing your workspace
      </p>
      <p className="text-xs text-muted-foreground animate-pulse">
        Initializing components...
      </p>
    </div>
  </div>
);

export const EditorError = () => (
  <div className="flex flex-col items-center justify-center h-full w-full gap-2 text-red-500">
    <AlertCircle className="size-6 animate-pulse" />{" "}
    <p className="text-sm font-medium">
      Error loading editor, please refresh the page!
    </p>
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

  const setEditor = useSetAtom(editorAtom);

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

  const canvasBackground = "var(--muted)";
  const gridColor = "var(--muted-foreground)";

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={setEditor}
      nodeTypes={nodeComponents}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={4}
      proOptions={{ hideAttribution: true }}
      className="bg-muted text-foreground transition-colors"
      style={{ background: canvasBackground }}
      snapGrid={[10, 10]}
      snapToGrid
      panOnScroll
      panOnDrag={false}
      selectionOnDrag
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={12}
        size={1}
        color={gridColor}
        bgColor={canvasBackground}
      />
      <Controls className="bg-card border !border-border !shadow-sm text-foreground backdrop-blur [&_button]:!bg-card [&_button]:!text-foreground [&_button]:!border-b [&_button]:!border-border [&_button]:!shadow-none [&_button:hover]:!bg-muted [&_button:last-child]:!border-b-0" />
      <MiniMap
        bgColor={canvasBackground}
        nodeColor="var(--card)"
        nodeStrokeColor="var(--border)"
      />
      <Panel position="top-right">
        <AddNodeButton />
      </Panel>
    </ReactFlow>
  );
};
