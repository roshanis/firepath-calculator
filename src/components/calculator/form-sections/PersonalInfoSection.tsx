
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CalculatorFormValues } from "@/types/calculator";
import { formatCurrency } from "@/utils/calculatorUtils";

interface PersonalInfoSectionProps {
  form: UseFormReturn<CalculatorFormValues>;
  showSpouseFields: boolean;
}

export const PersonalInfoSection = ({ form, showSpouseFields }: PersonalInfoSectionProps) => {
  return (
    <>
      <div className="col-span-2">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Information</h2>
      </div>

      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Age</FormLabel>
            <FormControl>
              <Input type="number" placeholder="30" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currentAnnualIncome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{showSpouseFields ? "Your Annual Income ($)" : "Current Annual Income ($)"}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="75,000"
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
        name="currentAnnualSavings"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{showSpouseFields ? "Your Annual Contributions (%)" : "Current Annual Contributions (%)"}</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.1"
                placeholder="12.5"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currentPortfolioValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{showSpouseFields ? "Your Portfolio Value ($)" : "Current Portfolio Value ($)"}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="100,000"
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
