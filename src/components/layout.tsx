import { Home, Cpu, Layers, Terminal, GitBranch, Clock, Network, Database, HardDrive, Lock, MemoryStick, FileText, Monitor } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "OS Types", url: "/os-types", icon: Layers },
  { title: "OS Structure", url: "/os-structure", icon: Monitor },
  { title: "System Calls", url: "/system-calls", icon: Terminal },
  { title: "Process Management", url: "/process-management", icon: GitBranch },
  { title: "CPU Scheduling", url: "/cpu-scheduling", icon: Cpu },
  { title: "Threads", url: "/threads", icon: Network },
  { title: "Synchronization", url: "/synchronization", icon: Lock },
  { title: "Deadlocks", url: "/deadlocks", icon: FileText },
  { title: "Memory Management", url: "/memory-management", icon: MemoryStick },
  { title: "Page Replacement", url: "/page-replacement", icon: Database },
  { title: "Disk Scheduling", url: "/disk-scheduling", icon: HardDrive },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-mono text-xs tracking-wider">
            {!collapsed && "OS Simulator"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-primary font-medium glow-primary"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 gap-3 shrink-0">
            <SidebarTrigger />
            <span className="text-sm font-mono text-muted-foreground">OS Simulator</span>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
