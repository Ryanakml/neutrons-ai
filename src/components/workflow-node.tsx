"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { SettingsIcon, TrashIcon } from "lucide-react";

interface WorkflowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export const WorkflowNode = ({
  children,
  showToolbar,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar
          isVisible
          position={Position.Top}
          className="flex items-center gap-2 bg-transparent p-0 shadow-none"
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={onSettings}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          >
            <SettingsIcon className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onDelete}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          >
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible={true}
          className="mt-2 flex max-w-50 flex-col items-center gap-0 bg-transparent p-0 text-center shadow-none"
        >
          <p className="text-sm font-medium leading-tight text-foreground">
            {name}
          </p>
          {description && (
            <p className="text-xs font-normal leading-tight text-muted-foreground">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};
