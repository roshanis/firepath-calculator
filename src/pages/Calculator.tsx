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
    const baseIncome = Math.min(annualIncome, 65000);
    const extraIncome = Math.max(0, annualIncome - 65000);
    
    const baseBenefit = baseIncome * 0.4;
    const extraBenefit = extraIncome * 0.1;
    
    return Math.min(baseBenefit + extraBenefit, 45240);
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
    
    const retirementAge = 65;
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
      // During working years, apply 25% tax rate to income
      const afterTaxSavings = currentSavings * (1 - workingTaxRate);
      
      yearlyBreakdown.push({
        age,
        portfolioValue: portfolio,
        contribution: afterTaxSavings,
        withdrawal: 0,
        isRetired: false,
        inflatedExpenses: currentExpenses,
        socialSecurityIncome: 0,
      });
      
      portfolio = (portfolio + afterTaxSavings) * (1 + annualReturn);
      currentExpenses *= (1 + inflationRate);
      currentSavings *= (1 + inflationRate);
      currentSocialSecurity *= (1 + inflationRate);
      age++;
    }
    
    for (let year = 1; year <= (lifeExpectancy - retirementAge); year++) {
      const ssIncome = age >= 67 ? currentSocialSecurity : 0;
      const grossWithdrawal = Math.max(currentExpenses - ssIncome, 0);
      
      // During retirement, apply 20% tax rate to withdrawals
      const withdrawal = grossWithdrawal / (1 - retirementTaxRate);
      
      yearlyBreakdown.push({
        age,
        portfolioValue: portfolio,
        contribution: 0,
        withdrawal,
        isRetired: true,
        inflatedExpenses: currentExpenses,
        socialSecurityIncome: ssIncome,
      });
      
      portfolio = portfolio - withdrawal;
      
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
        ? `You can retire successfully at age ${retirementAge}. Your portfolio will last until age ${lifeExpectancy}, accounting for taxes (25% working, 20% retired), 3% annual inflation, and estimated combined Social Security benefits starting at age 67${values.maritalStatus === "married" ? " for both spouses" : ""}.`
        : `Your portfolio may be depleted before age ${lifeExpectancy}. Consider increasing savings or adjusting retirement plans. This calculation includes taxes, inflation, and Social Security benefits${values.maritalStatus === "married" ? " for both spouses" : ""}.`,
      finalPortfolio: success ? portfolio : 0,
      retirementAge,
      yearlyBreakdown,
    };
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const calculationResult = calculateRetirement(values);
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
                    <FormLabel>{showSpouseFields ? "Combined Annual Income ($)" : "Current Annual Income ($)"}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={showSpouseFields ? "150000" : "75000"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showSpouseFields && (
                <>
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
                          <Input type="number" placeholder="75000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="currentAnnualSavings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{showSpouseFields ? "Combined Annual Savings ($)" : "Current Annual Savings ($)"}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={showSpouseFields ? "50000" : "25000"} {...field} />
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
                    <FormLabel>{showSpouseFields ? "Combined Annual Expenses ($)" : "Current Annual Expenses ($)"}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={showSpouseFields ? "100000" : "50000"} {...field} />
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
                    <FormLabel>{showSpouseFields ? "Combined Portfolio Value ($)" : "Current Portfolio Value ($)"}</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder={showSpouseFields ? "200000" : "100000"} {...field} />
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

              <FormField
                control={form.control}
                name="hsaContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual HSA Contribution ($) - Optional</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="3850" 
                        {...field} 
                      />
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

            <div className="mt-8">
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
                          ${year.inflatedExpenses.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
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
          </>
        )}
      </Card>
    </div>
  );
};

export default Calculator;
