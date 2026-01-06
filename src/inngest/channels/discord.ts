import { channel, topic } from "@inngest/realtime";

export const discordChannel = channel("discord-execution").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
    message?: string;
  }>()
);
