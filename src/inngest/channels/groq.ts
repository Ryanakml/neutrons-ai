import { channel, topic } from "@inngest/realtime";

export const groqChannel = channel("groq-execution").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);
