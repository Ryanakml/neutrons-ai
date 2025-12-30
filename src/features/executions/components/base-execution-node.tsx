"use client";

import React, { memo } from "react";
import Image from "next/image";
import { Position, useReactFlow, type NodeProps } from "@xyflow/react"; // Tambahkan useReactFlow
import { LucideIcon } from "lucide-react";
import { WorkflowNode } from "../../../components/workflow-node";
import { BaseNode } from "../../../components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import {
  type NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";

export interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: React.ReactNode;
  status: NodeStatus;
  onSettings?: () => void;
  onDelete?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    icon,
    name,
    description,
    children,
    status,
    onSettings,
    onDelete,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    const { deleteElements } = useReactFlow();

    const handleDelete = () => {
      deleteElements({ nodes: [{ id }] });

      if (onDelete) {
        onDelete();
      }
    };

    const renderIcon = () => {
      if (typeof icon === "string") {
        return (
          <Image
            src={icon}
            alt={name}
            width={20}
            height={20}
            className="object-contain"
          />
        );
      }
      const IconComponent = icon;
      return <IconComponent className="size-5 text-slate-500" />;
    };

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
        showToolbar
      >
        <div className="flex flex-col items-center gap-2">
          <NodeStatusIndicator status={status} variant="border">
            <BaseNode
              status={status}
              onDoubleClick={onDoubleClick}
              className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              {renderIcon()}

              {/* Input Port (Khas Execution Node) */}
              <BaseHandle
                id="target-1"
                type="target"
                position={Position.Left}
              />

              {/* Output Port */}
              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNode>
          </NodeStatusIndicator>

          {children}
        </div>
      </WorkflowNode>
    );
  }
);

BaseExecutionNode.displayName = "BaseExecutionNode";
