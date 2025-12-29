"use client";

import { useWorkflowsParams } from "../hooks/use-workflows-params";
import {
  useCreateWorkflow,
  useSuspenseWorkflows,
} from "../hooks/use-workflows";
import {
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  WorkflowIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityList,
  EntityListItem,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { formatDistanceToNow } from "date-fns";
import { useRemoveWorkflow } from "../hooks/use-workflows";
import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Workflow = RouterOutput["workflows"]["getMany"]["items"][number];

export const WorkflowList = () => {
  // throw new Error("text error") for testing error laoding state;
  const workflows = useSuspenseWorkflows();

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowListItem data={workflow} />}
      emptyView={<WorkflowsEmptyView />}
    />
  );
};

export const WorkflowSearch = () => {
  const [{ search }, setParams] = useWorkflowsParams();

  const [localSearch, setLocalSearch] = useState(search ?? "");
  const [prevSearch, setPrevSearch] = useState(search ?? "");

  // Sincronize state when rander
  if (search !== prevSearch) {
    setLocalSearch(search ?? "");
    setPrevSearch(search ?? "");
  }

  // Debounce Effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        setParams({ search: localSearch || null, page: 1 });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, search, setParams]);

  return (
    <div className="flex items-center gap-x-2 p-2 rounded-md border">
      <SearchIcon className="size-4 text-muted-foreground" />
      <Input
        placeholder="Search workflows..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="border focus-visible:ring-0 shadow-sm"
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

export const WorkflowsLoadingView = () => {
  return <LoadingView message="Loading workflows..." />;
};

export const WorkflowsErrorView = () => {
  return <ErrorView message="Failed to load workflows" />;
};

export const WorkflowsEmptyView = () => {
  const router = useRouter();
  const [{ search }] = useWorkflowsParams();
  const createWorkflow = useCreateWorkflow();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        toast.error(
          `Failed to create workflow: ${error.message}. Please Try again`
        );
      },
      onSuccess: (data) => {
        toast.success("Workflow created successfully");
        router.push(`/workflows/${data.id}`);
      },
    });
  };

  if (search) {
    return (
      <EmptyView
        message={`No result for "${search}". Create new one with this name?`}
        onNew={handleCreate}
      />
    );
  }

  return (
    <EmptyView
      message="There is no workflow. Create one to get started!"
      onNew={handleCreate}
    />
  );
};

export const WorkflowListItem = ({ data }: { data: Workflow }) => {
  const RemoveWorkflow = useRemoveWorkflow();

  const handleRemove = () => {
    RemoveWorkflow.mutate({ id: data.id });
  };

  return (
    <EntityListItem
      href={`/workflows/${data.id}`}
      title={data.name}
      subtitle={
        <>
          updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}
          {""}
          &bull; Created{""}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-9 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
          <WorkflowIcon className="size-5 text-primary" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={RemoveWorkflow.isPending}
    />
  );
};
