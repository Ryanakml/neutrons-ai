import { inngest } from "@/inngest/client";
import { prisma } from "../../lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(() => {
    return prisma.workflow.findMany({
      select: {
        id: true,
        name: true,
        aiResult: true,
      },
    });
  }),

  createWorkflow: protectedProcedure.mutation(async () => {
    const created = await prisma.workflow.create({
      data: {
        name: "New workflow",
      },
      select: {
        id: true,
        name: true,
        aiResult: true,
      },
    });

    await inngest.send({
      name: "workflow/ai.generate",
      data: {
        workflowId: created.id,
        prompt: `Berikan deskripsi singkat untuk workflow bernama "${created.name}".`,
      },
    });

    return created;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
