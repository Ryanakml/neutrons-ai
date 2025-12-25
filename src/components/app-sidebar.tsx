"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CreditCard,
  FolderKanban,
  History,
  KeyRound,
  LogOut,
  Star,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";

const mainNav = [
  { label: "Workflows", href: "/workflows", icon: FolderKanban },
  { label: "Credentials", href: "/credentials", icon: KeyRound },
  { label: "Executions", href: "/executions", icon: History },
];

const secondaryNav = [
  { label: "Upgrade to Pro", href: "/upgrade", icon: Star },
  { label: "Billing Portal", href: "/billing", icon: CreditCard },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/workflows") {
      return pathname === "/" || pathname.startsWith("/workflows");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.refresh();
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error("Unable to sign out", error);
    }
  };

  return (
    <Sidebar
      className="group bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-sidebar-accent group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="Neutrons Logo"
                  width={28}
                  height={28}
                  className="shrink-0 group-data-[collapsible=icon]:size-6"
                />
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold leading-tight">
                    Neutrons
                  </span>
                  <span className="text-xs text-sidebar-foreground/60">
                    Node automation
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    isActive={isActive(item.href)}
                    className={cn(
                      "rounded-lg transition-all duration-200",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground",
                      "data-[active=true]:shadow-sm"
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <span className="flex items-center justify-center shrink-0">
                        <item.icon size={16} />
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    className={cn(
                      "rounded-lg transition-all duration-200",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Link
                      href={item.href}
                      prefetch={false}
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <span
                        className={cn(
                          "flex items-center justify-center shrink-0",
                          item.label === "Upgrade to Pro" && "text-amber-500"
                        )}
                      >
                        <item.icon size={16} />
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className={cn(
                "rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "group-data-[collapsible=icon]:justify-center"
              )}
              tooltip="Sign out"
            >
              <span className="flex items-center justify-center shrink-0">
                <LogOut size={16} />
              </span>
              <span className="text-sm font-medium">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
