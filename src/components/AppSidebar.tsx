import {
  BookOpen, Database, Cpu, Brain, FlaskConical, Layers, BarChart3, PenTool, Send, LayoutDashboard, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const phases = [
  { title: "Literature", url: "/phase/1", icon: BookOpen, phase: 1 },
  { title: "Dataset Design", url: "/phase/2", icon: Database, phase: 2 },
  { title: "Feature Engineering", url: "/phase/3", icon: Cpu, phase: 3 },
  { title: "Model Selection", url: "/phase/4", icon: Brain, phase: 4 },
  { title: "FL Experiments", url: "/phase/5", icon: FlaskConical, phase: 5 },
  { title: "Ablation Study", url: "/phase/6", icon: Layers, phase: 6 },
  { title: "Statistical Validation", url: "/phase/7", icon: BarChart3, phase: 7 },
  { title: "Writing", url: "/phase/8", icon: PenTool, phase: 8 },
  { title: "Submission", url: "/phase/9", icon: Send, phase: 9 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider">
            {!collapsed && "Overview"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider">
            {!collapsed && "Research Phases"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {phases.map((item) => (
                <SidebarMenuItem key={item.phase}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && (
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{item.phase}.</span>
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
