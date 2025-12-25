import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./features/components/logout-button";

const Page = async () => {
  await requireAuth(); // Note: Added () to call the function

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <LogoutButton />
    </div>
  );
};

export default Page;
