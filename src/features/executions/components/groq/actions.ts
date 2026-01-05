"use server";

import { groqChannel } from "@/inngest/channels/groq";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type GroqToken = Realtime.Token<typeof groqChannel, ["status"]>;

export async function fetchGroqRealtimeToken(): Promise<GroqToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: groqChannel(),
    topics: ["status"],
  });

  return token;
}
