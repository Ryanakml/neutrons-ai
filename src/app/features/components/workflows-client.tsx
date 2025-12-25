"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

type Workflow = {
  id: string;
  name: string;
};

type WorkflowsClientProps = {
  initialData: Workflow[];
};

export function WorkflowsClient({ initialData }: WorkflowsClientProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const workflowsQuery = useQuery(
    trpc.getWorkflows.queryOptions(undefined, { initialData })
  );

  const createWorkflow = useMutation({
    ...trpc.createWorkflow.mutationOptions(),
    onSuccess: async (created) => {
      toast.success("job queued");
      // Refresh the workflows list after creating a new one.
      await queryClient.invalidateQueries({
        queryKey: trpc.getWorkflows.queryKey(),
      });
      return created;
    },
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        type="button"
        disabled={createWorkflow.isPending}
        onClick={() => createWorkflow.mutate()}
      >
        {createWorkflow.isPending ? "Creating..." : "Create workflow"}
      </Button>

      <pre className="text-sm">
        {workflowsQuery.isLoading
          ? "Loading..."
          : JSON.stringify(workflowsQuery.data ?? [], null, 2)}
      </pre>
    </div>
  );
}
