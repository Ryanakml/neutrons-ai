import { NodeExecutor } from "@/features/executions/types";

type manualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<manualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  // todo: publish loading state for manual manualTriggerData

  const result = await step.run(
    `manual-trigger-${nodeId}`,
    async () => context
  );

  //todo: publish success state a

  return result;
};
