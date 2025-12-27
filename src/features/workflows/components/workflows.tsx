"use client";

import { useWorkflowsParams } from "../hooks/use-workflows-params";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { SearchIcon, ChevronLeft, ChevronRight, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EntityContainer, EntityHeader } from "@/components/entity-components";
import { useEffect, useState } from "react";

export const WorkflowList = () => {
  const { data } = useSuspenseWorkflows();

  if (data.items.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
        No workflows found.
      </div>
    );
  }

  return (
    <div className="divide-y border rounded-lg bg-white">
      {data.items.map((workflow) => (
        <div
          key={workflow.id}
          className="p-4 flex justify-between items-center hover:bg-slate-50 transition"
        >
          <div>
            <h3 className="font-medium">{workflow.name}</h3>
            <p className="text-xs text-muted-foreground">ID: {workflow.id}</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/workflows/${workflow.id}`}>Open</Link>
          </Button>
        </div>
      ))}
    </div>
  );
};

export const WorkflowSearch = () => {
  const [{ search }, setParams] = useWorkflowsParams();

  const [localSearch, setLocalSearch] = useState(search ?? "");

  useEffect(() => {
    const handler = setTimeout(() => {
      setParams({ search: localSearch || null, page: 1 });
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, setParams]);

  useEffect(() => {
    setLocalSearch(search ?? "");
  }, [search]);

  return (
    <div className="flex items-center gap-x-2 bg-white p-2 rounded-md border">
      <SearchIcon className="size-4 text-muted-foreground" />
      <Input
        placeholder="Search workflows..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="border-none focus-visible:ring-0"
      />
    </div>
  );
};

export const WorkflowPagination = () => {
  const [{ page }, setParams] = useWorkflowsParams();
  const { data } = useSuspenseWorkflows();

  return (
    <div className="flex items-center justify-end gap-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        disabled={!data.hasPreviousPage}
        onClick={() => setParams({ page: page - 1 })}
      >
        <ChevronLeft className="size-4" />
      </Button>
      <span className="text-sm">
        Page {data.page} of {data.totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={!data.hasNextPage}
        onClick={() => setParams({ page: page + 1 })}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export const WorkflowsHeader = () => {
  const createMutation = useCreateWorkflow();
  return (
    <EntityHeader
      title="Workflows"
      description="Create and manage your automation flows"
      onNew={() => createMutation.mutate(undefined)}
      isCreating={createMutation.isPending}
    />
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowsHeader />}
      search={<WorkflowSearch />}
      pagination={<WorkflowPagination />}
    >
      {children}
    </EntityContainer>
  );
};
