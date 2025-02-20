
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CalculatorFormValues } from "@/types/calculator";
import { formatCurrency } from "@/utils/calculatorUtils";

interface HouseholdInfoSectionProps {
  form: UseFormReturn<CalculatorFormValues>;
}

export const HouseholdInfoSection = ({ form }: HouseholdInfoSectionProps) => {
  return (
    <>
      <div className="col-span-2 mt-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Household Information</h2>
      </div>

      <FormField
        control={form.control}
        name="currentAnnualExpenses"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annual Household Expenses ($)</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="50,000"
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={(e) => field.onChange(formatCurrency(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hsaContribution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annual HSA Contribution ($) - Optional</FormLabel>
            <FormControl>
              <Input 
                type="text"
                placeholder="3,850" 
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={(e) => field.onChange(formatCurrency(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
