import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import * as HandleBars from "handlebars";
import { groqChannel } from "@/inngest/channels/groq";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

HandleBars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(jsonString);

  return safeString;
});

type GroqData = {
  variableName?: string;
  model?:
    | "llama-3.3-70b-versatile"
    | "llama-3.1-70b-versatile"
    | "llama-3.1-8b-instant"
    | "mixtral-8x7b-32768"
    | "gemma2-9b-it";
  systemPrompt?: string;
  userPrompt?: string;
};

export const groqExecutor: NodeExecutor<GroqData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(groqChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    await publish(groqChannel().status({ nodeId, status: "loading" }));
    throw new NonRetriableError("Groq Node: Variable name is required");
  }

  if (!data.userPrompt) {
    await publish(groqChannel().status({ nodeId, status: "loading" }));
    throw new NonRetriableError("Groq Node: User prompt is required");
  }

  const systemPrompt = data.systemPrompt
    ? HandleBars.compile(data.systemPrompt)(context)
    : "you are a helpful assistant";

  const userPrompt = data.userPrompt
    ? HandleBars.compile(data.userPrompt)(context)
    : "";

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new NonRetriableError("Groq API key is not configured");
  }

  const groq = createGroq({
    apiKey,
  });

  try {
    const { steps } = await step.ai.wrap("groq-generate-text", generateText, {
      model: groq(data.model || "llama-3.1-8b-instant"),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const text =
      steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

    await publish(
      groqChannel().status({
        nodeId,
        status: "success",
      })
    );

    return {
      ...context,
      [data.variableName]: {
        aiResponse: text,
      },
    };
  } catch (error) {
    throw error;
  }
};
