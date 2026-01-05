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
    label: "Manual Trigger",
    description: "Start by clicking the Execute button",
    icon: MousePointer2Icon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "When a Google Form is submitted",
    icon: "/form.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe",
    description: "When a Stripe event occurs",
    icon: "/stripe.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Send a request to any endpoint",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Use Gemini AI to generate content",
    icon: "/gemini.png",
  },
  {
    type: NodeType.GROQ,
    label: "Groq",
    description: "Use Groq-hosted LLMs to generate content",
    icon: "/groq.png",
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
      <SheetContent
        side="right"
        className="w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-md"
      >
        <SheetHeader className="gap-2">
          <SheetTitle className="text-lg font-semibold text-slate-900">
            Add Workflow Node
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-600">
            Pick a trigger to start or an action to execute.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          <NodeGroup
            title="Triggers"
            options={triggerNodes}
            onSelect={handleNodeSelect}
          />

          <Separator />

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
      <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
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
      className="group relative flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 shadow-sm transition hover:-translate-y-px hover:border-slate-300 hover:bg-white hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 text-slate-600 transition group-hover:border-slate-300 group-hover:from-white group-hover:to-slate-50">
        {typeof Icon === "string" ? (
          <Image
            src={Icon}
            alt={node.label}
            width={24}
            height={24}
            className="object-contain"
          />
        ) : (
          <Icon className="size-6" />
        )}
      </div>
      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold text-slate-900">
          {node.label}
        </span>
        <span className="text-xs font-medium text-slate-500">
          {node.description}
        </span>
      </div>
    </div>
  );
}
