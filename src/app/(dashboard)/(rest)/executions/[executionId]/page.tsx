import {
  ExecutionDetails,
  ExecutionDetailsContainer,
  ExecutionDetailsError,
  ExecutionDetailsLoading,
} from "@/features/executions/components/execution-details";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  params: Promise<{
    executionId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();

  const { executionId } = await params;

  await prefetchExecution(executionId);

  return (
    <ExecutionDetailsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionDetailsError />}>
          <Suspense fallback={<ExecutionDetailsLoading />}>
            <ExecutionDetails executionId={executionId} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionDetailsContainer>
  );
};

export default Page;
