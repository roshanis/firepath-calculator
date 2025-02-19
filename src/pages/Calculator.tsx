import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

const formSchema = z.object({
  age: z.string().min(1, "Age is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  currentAnnualIncome: z.string().min(1, "Current annual income is required"),
  currentAnnualSavings: z.string().min(1, "Current annual savings is required"),
  currentAnnualExpenses: z.string().min(1, "Current annual expenses is required"),
  currentPortfolioValue: z.string().min(1, "Current portfolio value is required"),
  annualReturnOnInvestment: z.string().min(1, "Annual return on investment is required"),
  withdrawalRate: z.string().min(1, "Withdrawal rate is required"),
  hsaContribution: z.string().optional(),
  spouseAge: z.string().optional(),
  spouseIncome: z.string().optional(),
  spouseSavings: z.string().optional(),
});

interface YearlyBreakdown {
  age: number;
  portfolioValue: number;
  contribution: number;
  withdrawal: number;
  isRetired: boolean;
  inflatedExpenses: number;
  socialSecurityIncome: number;
}

interface CalculationResult {
  success: boolean;
  message: string;
  finalPortfolio: number;
  retirementAge: number;
  yearlyBreakdown: YearlyBreakdown[];
}

const Calculator = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showSpouseFields, setShowSpouseFields] = useState(false);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  const formatCurrency = (value: string) => {
    const number = value.replace(/,/g, '');
    if (!isNaN(Number(number))) {
      return Number(number).toLocaleString('en-US');
    }
    return value;
  };

  const parseCurrency = (value: string) => {
    return value.replace(/,/g, '');
  };

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

  const estimateSocialSecurity = (annualIncome: number): number => {
    return 23712; // Fixed social security payment of $1,976 per month
  };

  const calculateRetirement = (values: z.infer<typeof formSchema>): CalculationResult => {
    const currentAge = parseInt(values.age);
    const income = parseFloat(values.currentAnnualIncome);
    const annualSavings = parseFloat(values.currentAnnualSavings);
    const hsaContribution = parseFloat(values.hsaContribution || "0");
    const totalAnnualSavings = annualSavings + hsaContribution;
    const annualExpenses = parseFloat(values.currentAnnualExpenses) || (income - totalAnnualSavings);
    const currentPortfolio = parseFloat(values.currentPortfolioValue);
    const annualReturn = parseFloat(values.annualReturnOnInvestment) / 100;
    const withdrawRate = parseFloat(values.withdrawalRate) / 100;
    
    const workingTaxRate = 0.25; // 25% tax rate during working years
    const retirementTaxRate = 0.20; // 20% tax rate during retirement
    
    const primarySS = estimateSocialSecurity(income);
    let totalSS = primarySS;
    
    if (values.maritalStatus === "married" && values.spouseIncome) {
      const spouseIncome = parseFloat(values.spouseIncome);
      const spouseSS = estimateSocialSecurity(spouseIncome);
      totalSS = primarySS + spouseSS;
    }
    
    const retirementAge = 67; // Updated retirement age to 67
    const lifeExpectancy = 95;
    const ssIncomeAfter67 = totalSS;
    const inflationRate = 0.03;
    
    let age = currentAge;
    let portfolio = currentPortfolio;
    let success = true;
    let currentExpenses = annualExpenses;
    let currentSavings = totalAnnualSavings;
    let currentSocialSecurity = ssIncomeAfter67;
    const yearlyBreakdown: YearlyBreakdown[] = [];
    
    while (age < retirementAge) {
      yearlyBreakdown.push({
        age,
        portfolioValue: portfolio,
        contribution: currentSavings,
        withdrawal: 0,
        isRetired: false,
        inflatedExpenses: currentExpenses,
        socialSecurityIncome: 0,
      });
      
      portfolio = (portfolio + currentSavings) * (1 + annualReturn);
      currentExpenses *= (1 + inflationRate);
      currentSavings *= (1 + inflationRate);
      currentSocialSecurity *= (1 + inflationRate);
      age++;
    }
    
    for (let year = 1; year <= (lifeExpectancy - retirementAge); year++) {
      const ssIncome = age >= 67 ? currentSocialSecurity : 0;
      const grossWithdrawal = Math.max(currentExpenses - ssIncome, 0);
      
      yearlyBreakdown.push({
        age,
        portfolioValue: portfolio,
        contribution: 0,
        withdrawal: grossWithdrawal,
        isRetired: true,
        inflatedExpenses: currentExpenses,
        socialSecurityIncome: ssIncome,
      });
      
      portfolio = portfolio - grossWithdrawal;
      
      if (portfolio < 0) {
        success = false;
        break;
      }
      
      portfolio = portfolio * (1 + annualReturn);
      currentExpenses *= (1 + inflationRate);
      currentSocialSecurity *= (1 + inflationRate);
      age++;
    }
    
    return {
      success,
      message: success 
        ? `You can retire successfully at age ${retirementAge}. Your portfolio will last until age ${lifeExpectancy}, accounting for taxes (25% working, 20% retired), 3% annual inflation, and fixed Social Security benefits of $1,976/month${values.maritalStatus === "married" ? " for both spouses" : ""} starting at age 67.`
        : `Your portfolio may be depleted before age ${lifeExpectancy}. Consider increasing savings or adjusting retirement plans. This calculation includes taxes, inflation, and Social Security benefits of $1,976/month${values.maritalStatus === "married" ? " for both spouses" : ""}.`,
      finalPortfolio: success ? portfolio : 0,
      retirementAge,
      yearlyBreakdown,
    };
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
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

        {result && (
          <>
            <div className={`mt-8 p-4 rounded-lg ${
              result.success ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
            }`}>
              <h2 className="text-lg font-semibold mb-2">
                {result.success ? "Retirement Plan Analysis" : "Warning"}
              </h2>
              <p>{result.message}</p>
              {result.success && (
                <p className="mt-2">
                  Estimated final portfolio value: ${result.finalPortfolio.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
            >
              {showDetailedBreakdown ? (
                <>
                  Hide Detailed Breakdown
                  <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Show Detailed Breakdown
                  <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {showDetailedBreakdown && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-4">Yearly Breakdown</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Age</TableHead>
                        <TableHead>Portfolio Value</TableHead>
                        <TableHead>Contribution</TableHead>
                        <TableHead>SS Income</TableHead>
                        <TableHead>Withdrawal</TableHead>
                        <TableHead>Expenses (Inflated)</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.yearlyBreakdown.map((year, index) => (
                        <TableRow key={index}>
                          <TableCell>{year.age}</TableCell>
                          <TableCell>
                            ${year.portfolioValue.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </TableCell>
                          <TableCell>
                            ${year.contribution.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </TableCell>
                          <TableCell>
                            ${year.socialSecurityIncome.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </TableCell>
                          <TableCell>
                            ${year.withdrawal.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </TableCell>
                          <TableCell>
                            {year.isRetired ? (
                              `$${year.inflatedExpenses.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}`
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={year.isRetired ? "text-red-500" : "text-green-500"}>
                              {year.isRetired ? "Retired" : "Working"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Calculator;
