
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
  const income = parseFloat(parseCurrency(values.currentAnnualIncome));
  const annualSavings = income * 0.125; // Fixed 12.5% contribution rate
  const hsaContribution = parseFloat(parseCurrency(values.hsaContribution || "0"));
  const totalAnnualSavings = annualSavings + hsaContribution;
  const annualExpenses = parseFloat(parseCurrency(values.currentAnnualExpenses)) || (income - totalAnnualSavings);
  const currentPortfolio = parseFloat(parseCurrency(values.currentPortfolioValue));
  const annualReturn = parseFloat(values.annualReturnOnInvestment) / 100;
  const withdrawRate = parseFloat(values.withdrawalRate) / 100;
  
  const workingTaxRate = 0.25;
  const retirementTaxRate = 0.20;
  
  const primarySS = estimateSocialSecurity(income);
  let totalSS = primarySS;
  
  if (values.maritalStatus === "married" && values.spouseIncome) {
    const spouseIncome = parseFloat(parseCurrency(values.spouseIncome));
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
  let currentIncome = income;
  let currentSocialSecurity = ssIncomeAfter67;
  const yearlyBreakdown = [];
  
  // Continue working and saving until age 67
  while (age < retirementAge) {
    const yearlyContribution = (currentIncome * 0.125) + hsaContribution; // 12.5% of current income plus HSA
    yearlyBreakdown.push({
      age,
      portfolioValue: portfolio,
      contribution: yearlyContribution,
      withdrawal: 0,
      isRetired: false,
      inflatedExpenses: currentExpenses,
      socialSecurityIncome: 0,
    });
    
    portfolio = (portfolio + yearlyContribution) * (1 + annualReturn);
    currentExpenses *= (1 + inflationRate);
    currentIncome *= (1 + inflationRate); // Income increases with inflation
    age++;
  }
  
  // Start withdrawals and use Social Security at age 67
  for (let year = 1; year <= (lifeExpectancy - retirementAge); year++) {
    const ssIncome = totalSS;  // Now always using SS since we're already at 67
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
