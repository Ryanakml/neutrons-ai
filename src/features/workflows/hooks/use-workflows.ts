// Hook to fetch all workflows using suspense

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

export const useCreateWorkflow = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Workflow created successfully");
        router.push(`/workflows/${data.id}`);
        queryClient.invalidateQueries({
          queryKey: trpc.workflows.getMany.queryKey(),
        });
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`);
      },
    })
  );

  return mutation;
};
