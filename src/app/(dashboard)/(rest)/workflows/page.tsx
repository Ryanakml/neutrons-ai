import {
  WorkflowsContainer,
  WorkflowList,
  WorkflowsErrorView,
  WorkflowsLoadingView,
} from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { workflowParamsCache } from "@/features/workflows/server/params-loader";

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const Page = async ({ searchParams }: PageProps) => {
  await requireAuth();

  const params = await workflowParamsCache.parse(searchParams);

  await prefetchWorkflows(params);

  return (
    <HydrateClient>
      <WorkflowsContainer>
        <ErrorBoundary fallback={<WorkflowsErrorView />}>
          <Suspense fallback={<WorkflowsLoadingView />}>
            <WorkflowList />
          </Suspense>
        </ErrorBoundary>
      </WorkflowsContainer>
    </HydrateClient>
  );
};

export default Page;
