"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchgeminiRealtimeToken } from "./actions";
import { GeminiDialog, GeminiFormValues } from "./dialog";

type GeminiNodeData = {
  variableName?: string;
  model?:
    | "gemini-2.5-flash"
    | "gemini-2.5-pro"
    | "gemini-2.0-flash"
    | "gemini-2.0-flash-lite"
    | "gemini-1.5-flash"
    | "gemini-1.5-pro";
  systemPrompt?: string;
  userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleFormSubmit = (values: GeminiFormValues) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === props.id
          ? { ...node, data: { ...node.data, ...values } }
          : node
      )
    );
    setDialogOpen(false);
  };

  const nodeData = props.data;
  const description = nodeData?.userPrompt
    ? `${nodeData.model || "gemini-2.5-flash"}: ${nodeData.userPrompt.slice(
        0,
        50
      )}...`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "gemini-execution",
    topic: "status",
    refreshToken: fetchgeminiRealtimeToken,
  });

  return (
    <>
      <GeminiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleFormSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/gemini.png"
        name="Gemini"
        status={nodeStatus}
        description={description}
        onSettings={() => setDialogOpen(true)}
        onDoubleClick={() => setDialogOpen(true)}
      />
    </>
  );
});

GeminiNode.displayName = "GeminiNode";
