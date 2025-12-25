import { requireAuth } from "@/lib/auth-utils";
import { createCaller } from "@/trpc/server";
import { LogoutButton } from "./features/components/logout-button";
import { WorkflowsClient } from "./features/components/workflows-client";

const Page = async () => {
  await requireAuth();

  const caller = await createCaller();
  const data = await caller.getWorkflows();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <WorkflowsClient initialData={data} />
      <LogoutButton />
    </div>
  );
};

export default Page;
