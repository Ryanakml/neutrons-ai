"use client";

import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointer2Icon } from "lucide-react";
import { memo } from "react";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      icon={MousePointer2Icon}
      name="Manual Trigger"
      description="When you click the 'Execute' button"
      // onSettings={() => {}} // TODO
    />
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
