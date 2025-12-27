import {
  WorkflowList,
  WorkflowsContainer,
  WorkflowsHeader,
} from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async () => {
  await requireAuth();

  await prefetchWorkflows();

  return (
    <WorkflowsContainer header={<WorkflowsHeader />}>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Error</p>}>
          <Suspense fallback={<p>Loading...</p>}>
            <WorkflowList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
};

export default Page;
