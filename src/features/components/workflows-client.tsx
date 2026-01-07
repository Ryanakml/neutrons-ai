"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Workflow = RouterOutput["workflows"]["getMany"]["items"][number] & {
  aiResult?: string;
};

export function WorkflowsClient({ initialData }: { initialData: Workflow[] }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const workflowsQuery = useQuery(
    trpc.workflows.getMany.queryOptions(
      { page: 1, pageSize: 100 },
      {
        initialData: initialData
          ? {
              items: initialData,
              totalCount: initialData.length,
              page: 1,
              pageSize: 100,
              totalPages: 1,    
              hasNextPage: false,
              hasPreviousPage: false,
            }
          : undefined,
        refetchInterval: 1000,
      }
    )
  );

  // 2. Mutation untuk Create Workflow (via Inngest)
  const createWorkflow = useMutation({
    ...trpc.workflows.create.mutationOptions(),
    onSuccess: async () => {
      toast.success("Job queued");
      // Polling ringan: langsung refresh list supaya kita lihat aiResult ketika sudah terisi.
      await queryClient.invalidateQueries({
        queryKey: trpc.workflows.getMany.queryKey(),
      });
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-md border p-6 rounded-xl shadow-sm bg-gray-50">
      <div className="grid grid-cols-1 gap-4">
        <Button
          disabled={createWorkflow.isPending}
          onClick={() => createWorkflow.mutate({})}
        >
          {createWorkflow.isPending ? "Starting..." : "Create Workflow"}
        </Button>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-500">
          Current Workflows:
        </h2>
        <div className="space-y-3">
          {workflowsQuery.data?.items.length === 0 ? (
            <p className="text-gray-400 italic">No workflows found.</p>
          ) : (
            workflowsQuery.data?.items.map((workflow) => (
              <div
                key={workflow.id}
                className="rounded-lg border bg-gray-50 p-3 text-xs"
              >
                <div className="font-semibold text-sm">{workflow.name}</div>
                <div className="text-gray-500">{workflow.id}</div>
                <div className="mt-2 text-gray-800 whitespace-pre-wrap">
                  {workflow.aiResult
                    ? workflow.aiResult.split(" ").length > 10
                      ? workflow.aiResult.split(" ").slice(0, 10).join(" ") +
                        "..."
                      : workflow.aiResult
                    : "AI masih memproses..."}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
