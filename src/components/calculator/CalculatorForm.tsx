
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { calculateRetirement } from "@/utils/calculatorUtils";
import { formSchema, CalculationResult } from "@/types/calculator";
import type { CalculatorFormValues } from "@/types/calculator";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { MaritalStatusSection } from "./form-sections/MaritalStatusSection";
import { HouseholdInfoSection } from "./form-sections/HouseholdInfoSection";
import { InvestmentSection } from "./form-sections/InvestmentSection";

interface CalculatorFormProps {
  onCalculationComplete: (result: CalculationResult) => void;
}

export const CalculatorForm = ({ onCalculationComplete }: CalculatorFormProps) => {
  const [showSpouseFields, setShowSpouseFields] = useState(false);

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "30",
      maritalStatus: "single",
      currentAnnualIncome: "100,000",
      currentAnnualSavings: "12.5",
      currentAnnualExpenses: "50,000",
      currentPortfolioValue: "100,000",
      annualReturnOnInvestment: "7",
      withdrawalRate: "4",
      hsaContribution: "2,000",
      spouseAge: "",
      spouseIncome: "",
      spouseSavings: "",
    },
  });

  const maritalStatus = form.watch("maritalStatus");
  
  useEffect(() => {
    setShowSpouseFields(maritalStatus === "married");
  }, [maritalStatus]);

  function onSubmit(values: CalculatorFormValues) {
    try {
      const calculationResult = calculateRetirement(values);
      onCalculationComplete(calculationResult);
      // Save form data to localStorage
      localStorage.setItem('retirementCalculatorData', JSON.stringify(values));
      toast(calculationResult.success ? "Success" : "Warning", {
        description: calculationResult.message,
      });
    } catch (error) {
      toast("Error", {
        description: "There was an error calculating your retirement plan. Please check your inputs.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalInfoSection form={form} showSpouseFields={showSpouseFields} />
          <MaritalStatusSection form={form} showSpouseFields={showSpouseFields} />
          <HouseholdInfoSection form={form} />
          <InvestmentSection form={form} />
        </div>

        <Button type="submit" className="w-full" size="lg">
          Calculate
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};
