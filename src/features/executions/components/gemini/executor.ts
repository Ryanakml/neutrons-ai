import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import * as HandleBars from "handlebars";
import { geminiChannel } from "@/inngest/channels/gemini";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

HandleBars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(jsonString);

  return safeString;
});

type GeminiData = {
  variableName?: string;
  model?:
    | "gemini-2.5-flash"
    | "gemini-2.5-pro"
    | "gemini-2.0-flash"
    | "gemini-2.0-flash-lite"
    | "gemini-1.5-flash"
    | "gemini-1.5-pro";
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishErrorStatus = async (message: string) => {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
        message,
      })
    );
  };

  await publish(geminiChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) {
    const message = "Gemini Node: Variable name is required";
    await publishErrorStatus(message);
    throw new NonRetriableError(message);
  }

  if (!data.userPrompt) {
    const message = "Gemini Node: User prompt is required";
    await publishErrorStatus(message);
    throw new NonRetriableError(message);
  }

  // todo: check credentials

  const systemPrompt = data.systemPrompt
    ? HandleBars.compile(data.systemPrompt)(context)
    : "you are a helpful assistant";

  const userPrompt = data.userPrompt
    ? HandleBars.compile(data.userPrompt)(context)
    : "";

  // todo: fetcth the API key from secure storage
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const message = "Gemini API key is not configured";
    await publishErrorStatus(message);
    throw new NonRetriableError(message);
  }

  const google = createGoogleGenerativeAI({
    apiKey,
  });

  try {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google(data.model || "gemini-2.5-flash"),
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
      geminiChannel().status({
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
    const errorMessage =
      error instanceof Error
        ? error.stack || error.message
        : "Gemini Node: Unknown error occurred";

    await publishErrorStatus(errorMessage);
    throw error;
  }
};
