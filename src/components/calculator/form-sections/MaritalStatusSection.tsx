
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CalculatorFormValues } from "@/types/calculator";
import { formatCurrency } from "@/utils/calculatorUtils";

interface MaritalStatusSectionProps {
  form: UseFormReturn<CalculatorFormValues>;
  showSpouseFields: boolean;
}

export const MaritalStatusSection = ({ form, showSpouseFields }: MaritalStatusSectionProps) => {
  return (
    <>
      <div className="col-span-2 mt-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Marital Status</h2>
      </div>

      <FormField
        control={form.control}
        name="maritalStatus"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Marital Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {showSpouseFields && (
        <>
          <div className="col-span-2 mt-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Spouse Information</h2>
          </div>

          <FormField
            control={form.control}
            name="spouseAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spouse's Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="spouseIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spouse's Annual Income ($)</FormLabel>
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
        </>
      )}
    </>
  );
};
