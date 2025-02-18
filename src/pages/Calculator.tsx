
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const formSchema = z.object({
  age: z.string().min(1, "Age is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  currentAnnualIncome: z.string().min(1, "Current annual income is required"),
  currentAnnualSavings: z.string().min(1, "Current annual savings is required"),
  currentAnnualExpenses: z.string().min(1, "Current annual expenses is required"),
  currentPortfolioValue: z.string().min(1, "Current portfolio value is required"),
  annualReturnOnInvestment: z.string().min(1, "Annual return on investment is required"),
  withdrawalRate: z.string().min(1, "Withdrawal rate is required"),
});

const Calculator = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      maritalStatus: "",
      currentAnnualIncome: "",
      currentAnnualSavings: "",
      currentAnnualExpenses: "",
      currentPortfolioValue: "",
      annualReturnOnInvestment: "",
      withdrawalRate: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <Card className="max-w-2xl mx-auto p-6 glass">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Independence Calculator</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
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

              <FormField
                control={form.control}
                name="currentAnnualIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Annual Income ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="75000" {...field} />
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
                    <FormLabel>Current Annual Savings ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentAnnualExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Annual Expenses ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
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
                    <FormLabel>Current Portfolio Value ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            <Button type="submit" className="w-full" size="lg">
              Calculate
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Calculator;
