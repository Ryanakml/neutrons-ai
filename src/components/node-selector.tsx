"use client";

import React, { useCallback } from "react";
import { GlobeIcon, MousePointer2Icon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2"; 
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { NodeType } from "@/config/node-types";
import type { NodeType as NodeTypeValue } from "@/config/node-types";
import Image from "next/image";

// Type
export type NodeTypeOption = {
  type: NodeTypeValue;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

// Constants
const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger Manually",
    description: "Get started by clicking button",
    icon: MousePointer2Icon,
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP REQUEST",
    description: "Make a http req",
    icon: GlobeIcon,
  },
];

// Main Component
export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      // 1. Validation: Manual Trigger only one accepted
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (n) => n.type === NodeType.MANUAL_TRIGGER
        );
        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed per workflow");
          return;
        }
      }

      setNodes((nodes) => {
        // Logic position right now
        const flowPosition = screenToFlowPosition({
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
          y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: { label: selection.label },
          position: flowPosition,
          type: selection.type,
        };

        // If there is initial nodes, change all
        const hasInitialTrigger = nodes.some(
          (n) => n.type === NodeType.INITIAL
        );
        return hasInitialTrigger ? [newNode] : [...nodes, newNode];
      });

      onOpenChange(false);
    },
    [setNodes, getNodes, onOpenChange, screenToFlowPosition]
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Workflow Node</SheetTitle>
          <SheetDescription>
            Choose a trigger to start or an action to execute.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* Section Triggers */}
          <NodeGroup
            title="Triggers"
            options={triggerNodes}
            onSelect={handleNodeSelect}
          />

          <Separator />

          {/* Section Actions */}
          <NodeGroup
            title="Actions"
            options={executionNodes}
            onSelect={handleNodeSelect}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Sub-components

function NodeGroup({
  title,
  options,
  onSelect,
}: {
  title: string;
  options: NodeTypeOption[];
  onSelect: (node: NodeTypeOption) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      {options.map((node) => (
        <NodeItem key={node.type} node={node} onClick={() => onSelect(node)} />
      ))}
    </div>
  );
}

function NodeItem({
  node,
  onClick,
}: {
  node: NodeTypeOption;
  onClick: () => void;
}) {
  const Icon = node.icon;

  return (
    <div
      className="w-full flex items-center gap-4 p-4 rounded-lg cursor-pointer border hover:bg-accent transition-colors group"
      onClick={onClick}
    >
      <div className="shrink-0 size-10 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 rounded-md transition-colors">
        {typeof Icon === "string" ? (
          <Image src={Icon} alt="" className="size-6 object-contain" />
        ) : (
          <Icon className="size-6 text-primary" />
        )}
      </div>
      <div className="flex flex-col text-left">
        <span className="font-medium text-sm">{node.label}</span>
        <span className="text-xs text-muted-foreground">
          {node.description}
        </span>
      </div>
    </div>
  );
}
