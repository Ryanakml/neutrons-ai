import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./mode-toggle";

export const AppHeader = () => {
  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between gap-2 border-b px-4 bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <ModeToggle />
    </header>
  );
};
