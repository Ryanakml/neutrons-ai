"use client";

import { EntityHeader } from "@/components/entity-components";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import React from "react";
import { toast } from "sonner";

export const WorkflowList = () => {
  const workflows = useSuspenseWorkflows();

  return <p>{JSON.stringify(workflows.data, null, 2)}</p>;
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflowMutation = useCreateWorkflow();

  const handleCreateWorkflow = () => {
    createWorkflowMutation.mutate(undefined, {
      onSuccess: () => {
        console.log("Workflow created successfully");
      },
      onError: () => {
        console.log("Failed to create workflow");
      },
    });
  };
  return (
    <>
      <EntityHeader
        title="Workflows"
        description="Create and manage workflows"
        onNew={handleCreateWorkflow}
        isCreating={createWorkflowMutation.isPending}
      />
    </>
  );
};

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const WorkflowsContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="flex flex-col h-full p-4 md:p-6 space-y-6">
      {header && <div>{header}</div>}
      {search && <div>{search}</div>}
      <div>{children}</div>
      {pagination && <div>{pagination}</div>}
    </div>
  );
};
