"use client";

import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { Realtime } from "@inngest/realtime";
import { useMemo } from "react";
import { useInngestSubscription } from "@/inngest/realtime/hooks";

interface InngestData {
  nodeId: string;
  status: string;
}

interface InngestMessage {
  kind: string;
  channel: string;
  topic: string;
  createdAt: string;
  data: InngestData;
}

interface UseNodeStatusOption {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export function useNodeStatus({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusOption) {
  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  const status = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return "initial" as NodeStatus;
    }

    const messages = data as unknown as InngestMessage[];

    const latestMessage = messages
      .filter(
        (msg) =>
          msg.kind === "data" &&
          msg.channel === channel &&
          msg.topic === topic &&
          msg.data?.nodeId === nodeId
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

    return (latestMessage?.data?.status as NodeStatus) || "initial";
  }, [data, nodeId, channel, topic]);

  return status;
}
