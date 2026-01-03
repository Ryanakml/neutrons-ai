import { NodeExecutor } from "@/features/executions/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

type manualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<manualTriggerData> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(manualTriggerChannel().status({ nodeId, status: "loading" }));

  try {
    const result = await step.run(
      `manual-trigger-${nodeId}`,
      async () => context
    );

    await publish(manualTriggerChannel().status({ nodeId, status: "success" }));

    return result;
  } catch (error) {
    await publish(manualTriggerChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
