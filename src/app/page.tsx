import { requireAuth } from "@/lib/auth-utils";
import { createCaller } from "@/trpc/server";
import { LogoutButton } from "../features/components/logout-button";
import { WorkflowsClient } from "../features/components/workflows-client";

const Page = async () => {
  await requireAuth();

  const caller = await createCaller();
  // Mengambil data awal untuk ditampilkan di list
  const data = await caller.getWorkflows();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-2xl font-bold">Workflow Dashboard</h1>

      {/* Mengirim data awal ke client */}
      <WorkflowsClient initialData={data} />

      <LogoutButton />
    </div>
  );
};

export default Page;
