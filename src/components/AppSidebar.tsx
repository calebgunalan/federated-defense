import {
  LayoutDashboard, Database, Cpu, FlaskConical, Users, Layers, BarChart3, FileCode, Send, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const pages = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, num: 1 },
  { title: "Dataset & Heterogeneity", url: "/dataset", icon: Database, num: 2 },
  { title: "Baseline Architectures", url: "/baseline", icon: Cpu, num: 3 },
  { title: "Two-Client Federation", url: "/two-client", icon: Users, num: 4 },
  { title: "Three-Client Federation", url: "/three-client", icon: FlaskConical, num: 5 },
  { title: "Ablation Study", url: "/ablation", icon: Layers, num: 6 },
  { title: "Statistical Validation", url: "/statistical", icon: BarChart3, num: 7 },
  { title: "LaTeX Paper", url: "/latex", icon: FileCode, num: 8 },
  { title: "Submission Checklist", url: "/submission", icon: Send, num: 9 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider">
            {!collapsed && "Paper Sections"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pages.map((item) => (
                <SidebarMenuItem key={item.num}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && (
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{item.num}.</span>
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <Button variant="ghost" size={collapsed ? "icon" : "default"} className="w-full justify-start" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
