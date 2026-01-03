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

export const useUpdateWorkflowName = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} updated successfully`);
        queryClient.invalidateQueries({
          queryKey: trpc.workflows.getMany.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.workflows.getOne.queryKey({ id: data.id }),
        });
      },
      onError: (error) => {
        toast.error(`Failed to update workflow: ${error.message}`);
      },
    })
  );

  return mutation;
};

export const useExecuteWorkflow = () => {
  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.workflows.execute.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} is running ...`);
      },
      onError: (error) => {
        toast.error(`Failed to run workflow: ${error.message}`);
      },
    })
  );

  return mutation;
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const mutation = useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow state saved!`);

        queryClient.invalidateQueries({
          queryKey: trpc.workflows.getMany.queryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: trpc.workflows.getOne.queryKey({ id: data.id }),
        });
      },
      onError: (error) => {
        toast.error(`Failed to update workflow: ${error.message}`);
      },
    })
  );

  return mutation;
};

export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation({
    ...trpc.workflows.remove.mutationOptions(),
    onSuccess: async (data) => {
      toast.success(`Workflow ${data.name} removed`);
      await queryClient.invalidateQueries({
        queryKey: trpc.workflows.getMany.queryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: trpc.workflows.getOne.queryKey({ id: data.id }),
      });
    },
    onError: (error) => {
      toast.error(`Failed to remove workflow: ${error.message}`);
    },
  });
};

export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};
