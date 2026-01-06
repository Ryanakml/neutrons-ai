import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import * as HandleBars from "handlebars";
import { discordChannel } from "@/inngest/channels/discord";
import { decode } from "html-entities";
import ky from "ky";

HandleBars.registerHelper("json", function (context) {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new HandleBars.SafeString(jsonString);

  return safeString;
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishErrorStatus = async (message: string) => {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
        message,
      })
    );
  };

  await publish(discordChannel().status({ nodeId, status: "loading" }));

  if (!data.content) {
    const message = "Discord Node: content required";
    await publishErrorStatus(message);
    throw new NonRetriableError(message);
  }

  const rawContent = HandleBars.compile(data.content)(context);
  const content = decode(rawContent);

  const username = data.username
    ? decode(HandleBars.compile(data.username)(content))
    : undefined;

  try {
    const result = await step.run("discord-webhook", async () => {
      if (!data.webhookUrl) {
        const message = "Discord Node: webhookUrl required";
        await publishErrorStatus(message);
        throw new NonRetriableError(message);
      }

      await ky.post(data.webhookUrl, {
        json: {
          content: content.slice(0, 2000),
          username,
        },
      });

      if (!data.variableName) {
        const message = "Discord Node: variableName required";
        await publishErrorStatus(message);
        throw new NonRetriableError(message);
      }

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(discordChannel().status({ nodeId, status: "success" }));

    return result;
  } catch (error) {
    await publish(
      discordChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw error;
  }
};
