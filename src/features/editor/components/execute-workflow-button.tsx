import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConicalIcon } from "lucide-react";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId });
  };
  return (
    <Button
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
      size="lg"
      className="mb-4"
    >
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};
