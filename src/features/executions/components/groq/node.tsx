"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { useNodeStatus } from "../../hooks/use-node-status";
import { fetchGroqRealtimeToken } from "./actions";
import { GroqDialog, GroqFormValues } from "./dialog";

type GroqNodeData = {
  variableName?: string;
  model?:
    | "llama-3.3-70b-versatile"
    | "llama-3.1-70b-versatile"
    | "llama-3.1-8b-instant"
    | "mixtral-8x7b-32768"
    | "gemma2-9b-it";
  systemPrompt?: string;
  userPrompt?: string;
};

type GroqNodeType = Node<GroqNodeData>;

export const GroqNode = memo((props: NodeProps<GroqNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleFormSubmit = (values: GroqFormValues) => {
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
    ? `${nodeData.model || "llama-3.1-8b-instant"}: ${nodeData.userPrompt.slice(
        0,
        50
      )}...`
    : "Not configured";

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: "groq-execution",
    topic: "status",
    refreshToken: fetchGroqRealtimeToken,
  });

  return (
    <>
      <GroqDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleFormSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/groq.png"
        name="Groq"
        status={nodeStatus}
        description={description}
        onSettings={() => setDialogOpen(true)}
        onDoubleClick={() => setDialogOpen(true)}
      />
    </>
  );
});

GroqNode.displayName = "GroqNode";
