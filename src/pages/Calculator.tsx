import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CalculationResults } from "@/components/calculator/CalculationResults";
import { formatCurrency, parseCurrency, calculateRetirement } from "@/utils/calculatorUtils";
import { formSchema, CalculationResult } from "@/types/calculator";
import type { CalculatorFormValues } from "@/types/calculator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CalculatorSidebar } from "@/components/calculator/CalculatorSidebar";

const Calculator = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showSpouseFields, setShowSpouseFields] = useState(false);

  const form = useForm<CalculatorFormValues>({
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
      hsaContribution: "",
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
      const processedValues = {
        ...values,
        currentAnnualIncome: parseCurrency(values.currentAnnualIncome),
        currentAnnualSavings: parseCurrency(values.currentAnnualSavings),
        currentAnnualExpenses: parseCurrency(values.currentAnnualExpenses),
        currentPortfolioValue: parseCurrency(values.currentPortfolioValue),
        hsaContribution: values.hsaContribution ? parseCurrency(values.hsaContribution) : "",
        spouseIncome: values.spouseIncome ? parseCurrency(values.spouseIncome) : "",
        spouseSavings: values.spouseSavings ? parseCurrency(values.spouseSavings) : "",
      };
      
      const calculationResult = calculateRetirement(processedValues);
      setResult(calculationResult);
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CalculatorSidebar />
        <div className="flex-1 bg-gradient-to-b from-white to-gray-50 py-12">
          <Card className="max-w-2xl mx-auto p-6 glass">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Independence Calculator</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <FormLabel>{showSpouseFields ? "Your Annual Savings ($)" : "Current Annual Savings ($)"}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="25,000"
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
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Calculate
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>

            {result && <CalculationResults result={result} />}
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Calculator;
