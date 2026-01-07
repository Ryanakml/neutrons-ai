import { executionsServer } from "@/features/executions/server/routers";
import { createTRPCRouter } from "../init";
import { workflowsRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  executions: executionsServer
});

// export type definition of API
export type AppRouter = typeof appRouter;
