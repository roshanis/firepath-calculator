
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { CalculationResults } from "@/components/calculator/CalculationResults";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";
import type { CalculationResult } from "@/types/calculator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CalculatorSidebar } from "@/components/calculator/CalculatorSidebar";

const Calculator = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CalculatorSidebar />
        <div className="flex-1 bg-gradient-to-b from-white to-gray-50 py-4 sm:py-12 px-3 sm:px-6 overflow-x-hidden">
          <Card className="max-w-2xl mx-auto p-3 sm:p-6 glass">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">Financial Independence Calculator</h1>
            <CalculatorForm onCalculationComplete={setResult} />
            {result && <CalculationResults result={result} />}
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Calculator;
