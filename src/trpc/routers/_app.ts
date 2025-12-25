import { createTRPCRouter, protectedProcedure } from "../init";
import { prisma } from "../../lib/db";
import { inngest } from "@/inngest/client";
import { success } from "zod";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(() => {
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }

    return prisma.workflow.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "m@no.com",
      },
    });

    return { success: true, message: "job queued" };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
