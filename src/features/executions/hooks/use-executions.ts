import { useTRPC } from "@/trpc/client";
import { useExecutionsParams } from "./use-executions-params";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();

  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};

export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};
