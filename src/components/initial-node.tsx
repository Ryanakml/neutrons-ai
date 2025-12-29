"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
  console.log("InitialNode Rendered!", props.type);
  const [selectorOpen, setSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
          <div className="flex items-center justify-center cursor-pointer">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";
