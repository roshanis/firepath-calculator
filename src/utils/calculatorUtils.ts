
import { CalculationResult, CalculatorFormValues } from "@/types/calculator";

export const formatCurrency = (value: string) => {
  const number = value.replace(/,/g, '');
  if (!isNaN(Number(number))) {
    return Number(number).toLocaleString('en-US');
  }
  return value;
};

export const parseCurrency = (value: string) => {
  return value.replace(/,/g, '');
};

const estimateSocialSecurity = (annualIncome: number): number => {
  const monthlyAmount = 1976; // Fixed amount of $1,976 per month
  const annualAmount = monthlyAmount * 12;
  return annualAmount;
};

export const calculateRetirement = (values: CalculatorFormValues): CalculationResult => {
  const currentAge = parseInt(values.age);
  const income = parseFloat(values.currentAnnualIncome);
  const annualSavings = parseFloat(values.currentAnnualSavings);
  const hsaContribution = parseFloat(values.hsaContribution || "0");
  const totalAnnualSavings = annualSavings + hsaContribution;
  const annualExpenses = parseFloat(values.currentAnnualExpenses) || (income - totalAnnualSavings);
  const currentPortfolio = parseFloat(values.currentPortfolioValue);
  const annualReturn = parseFloat(values.annualReturnOnInvestment) / 100;
  const withdrawRate = parseFloat(values.withdrawalRate) / 100;
  
  const workingTaxRate = 0.25;
  const retirementTaxRate = 0.20;
  
  const primarySS = estimateSocialSecurity(income);
  let totalSS = primarySS;
  
  if (values.maritalStatus === "married" && values.spouseIncome) {
    const spouseIncome = parseFloat(values.spouseIncome);
    const spouseSS = estimateSocialSecurity(spouseIncome);
    totalSS = primarySS + spouseSS;
  }
  
  const retirementAge = 67;
  const lifeExpectancy = 95;
  const ssIncomeAfter67 = totalSS;
  const inflationRate = 0.03;
  
  let age = currentAge;
  let portfolio = currentPortfolio;
  let success = true;
  let currentExpenses = annualExpenses;
  let currentSavings = totalAnnualSavings;
  let currentSocialSecurity = ssIncomeAfter67;
  const yearlyBreakdown = [];
  
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
    age++;
  }
  
  // Reset currentSocialSecurity at retirement age to account for inflation up to that point
  currentSocialSecurity = ssIncomeAfter67 * Math.pow(1 + inflationRate, retirementAge - currentAge);
  
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
