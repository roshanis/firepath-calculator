
import { Card } from "@/components/ui/card";
import { MonteCarloForm } from "@/components/montecarlo/MonteCarloForm";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CalculatorSidebar } from "@/components/calculator/CalculatorSidebar";

const MonteCarloSimulation = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CalculatorSidebar />
        <div className="flex-1 bg-gradient-to-b from-white to-gray-50 py-12 px-6">
          <Card className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Monte Carlo Simulation</h1>
            <p className="text-gray-600 mb-8">
              This Monte Carlo simulation supports planning for financial goals and related spending. Multiple cashflow goals can be applied based on different life stages, and the simulation supports the use of a linear glide path to transition from a career stage growth portfolio into a retirement stage income portfolio.
            </p>
            <MonteCarloForm />
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MonteCarloSimulation;
