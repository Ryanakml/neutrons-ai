import { AppHeader } from "@/components/app-header";

const RestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
};

export default RestLayout;
