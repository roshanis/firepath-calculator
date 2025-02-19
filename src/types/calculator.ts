
import { z } from "zod";

export interface YearlyBreakdown {
  age: number;
  portfolioValue: number;
  contribution: number;
  withdrawal: number;
  isRetired: boolean;
  inflatedExpenses: number;
  socialSecurityIncome: number;
}

export interface CalculationResult {
  success: boolean;
  message: string;
  finalPortfolio: number;
  retirementAge: number;
  yearlyBreakdown: YearlyBreakdown[];
}

export const formSchema = z.object({
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

export type CalculatorFormValues = z.infer<typeof formSchema>;
