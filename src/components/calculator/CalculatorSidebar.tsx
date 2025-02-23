
import { Link, useLocation } from "react-router-dom";
import { Calculator, ArrowUpDown, Stethoscope, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

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
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <>
      {/* Mobile Menu Trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        asChild
      >
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </SidebarTrigger>
      </Button>

      {/* Sidebar Content */}
      <Sidebar variant={isMobile ? "floating" : "sidebar"}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs sm:text-sm pt-8 md:pt-0">Financial Planning</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={location.pathname === item.url}>
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-2 text-xs sm:text-sm"
                        onClick={() => {
                          if (isMobile) {
                            toggleSidebar();
                          }
                        }}
                      >
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
    </>
  );
}
