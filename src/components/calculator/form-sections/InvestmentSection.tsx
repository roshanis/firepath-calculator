
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CalculatorFormValues } from "@/types/calculator";

interface InvestmentSectionProps {
  form: UseFormReturn<CalculatorFormValues>;
}

export const InvestmentSection = ({ form }: InvestmentSectionProps) => {
  return (
    <>
      <div className="col-span-2 mt-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Investment Parameters</h2>
      </div>

      <FormField
        control={form.control}
        name="annualReturnOnInvestment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annual Return on Investment (%)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="7" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="withdrawalRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Withdrawal Rate (%)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="4" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
