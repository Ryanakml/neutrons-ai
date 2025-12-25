import { prisma } from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // 1
    await step.sleep("wait-a-moment", "5s");

    // 2
    await step.sleep("wait-a-moment", "5s");

    // 3
    await step.sleep("wait-a-moment", "5s");

    await step.run("create-workflow", () => {
      return prisma.workflow.create({
        data: {
          name: "workflow-inngest",
        },
      });
    });
  }
);
