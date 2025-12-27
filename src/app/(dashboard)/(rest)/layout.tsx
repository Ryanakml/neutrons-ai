import { ModeToggle } from "@/components/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AppHeader = () => {
  return (
    // Tambahkan w-full di sini
    <header className="flex h-14 w-full shrink-0 items-center justify-between gap-2 border-b px-4 bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <ModeToggle />
    </header>
  );
};

const RestLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader />
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
};

export default RestLayout;
