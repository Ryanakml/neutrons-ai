import { RegisterForm } from "@/app/features/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <RegisterForm />
    </main>
  );
};

export default Page;
