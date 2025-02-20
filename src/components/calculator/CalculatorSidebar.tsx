
import { Link } from "react-router-dom";
import { Calculator, LifeBuoy, HeartPulse } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useState } from "react";

const menuItems = [
  {
    title: "Monte Carlo Simulation",
    url: "/calculator",
    icon: Calculator,
  },
  {
    title: "Life Challenges",
    url: "/life-challenges",
    icon: LifeBuoy,
  },
  {
    title: "Healthcare Calculator",
    url: "/healthcare-calculator",
    icon: HeartPulse,
  },
];

export function CalculatorSidebar() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <div 
          className="relative"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <Sidebar 
            className={`transition-all duration-300 ease-in-out ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            }`}
            variant="floating"
          >
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Financial Planning</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={item.url} className="flex items-center gap-2">
                            <item.icon className="h-5 w-5" />
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
          {/* Hover trigger area */}
          <div 
            className={`fixed left-0 top-0 h-full w-4 bg-transparent z-50 transition-opacity duration-300 ${
              isVisible ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
