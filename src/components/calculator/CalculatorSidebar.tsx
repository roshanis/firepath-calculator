
import { Link, useLocation } from "react-router-dom";
import { Calculator, ArrowUpDown, Stethoscope } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Retirement Calculator",
    url: "/calculator",
    icon: Calculator,
  },
  {
    title: "Monte Carlo Simulation",
    url: "/monte-carlo",
    icon: ArrowUpDown,
  },
  {
    title: "Healthcare Planning",
    url: "/healthcare-calculator",
    icon: Stethoscope,
  },
];

export function CalculatorSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm">Financial Planning</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-active={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-2 text-xs sm:text-sm">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{item.title}</span>
                    </Link>
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
