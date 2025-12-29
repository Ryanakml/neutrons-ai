import { generateText } from "ai";
import { google } from "@ai-sdk/google";
// import { prisma } from "../lib/db";
import { inngest } from "./client";

export const execute = inngest.createFunction(
  { id: "workflow-ai-generate", retries: 3 },
  { event: "workflow/ai.generate" },
  async ({ event, step }) => {
    const { workflowId, prompt } = event.data;

    if (typeof workflowId !== "string") {
      throw new Error("Invalid or missing workflowId");
    }

    const safePrompt = typeof prompt === "string" ? prompt : "Generate text.";

    const text = await step.run("gemini-generate-text", async () => {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: safePrompt,
      });
      return result.text;
    });

    // await step.run("update-database", async () => {
    //   await prisma.workflow.update({
    //     where: { id: workflowId },
    //     data: { aiResult: text ?? "No result" },
    //   });
    // });

    return { workflowId, text };
  }
);

export const handleFailure = inngest.createFunction(
  { id: "ai-failure-handler" },
  { event: "inngest/function.failed" },
  async ({ event }) => {
    const { error, function_id } = event.data;
    console.error(`Fungsi ${function_id} gagal total:`, error);
  }
);
