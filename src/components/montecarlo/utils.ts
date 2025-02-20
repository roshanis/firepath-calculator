
import { Portfolio, SimulationDataPoint } from './types';
import { assetClasses, portfolioAllocations } from './constants';

const generateNormalRandom = (mean: number, stdDev: number) => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + stdDev * z;
};

const calculatePortfolioReturn = (allocation: Portfolio) => {
  let totalReturn = 0;
  for (const [asset, weight] of Object.entries(allocation)) {
    const assetClass = assetClasses[asset as keyof typeof assetClasses];
    const assetReturn = generateNormalRandom(assetClass.meanReturn, assetClass.volatility);
    totalReturn += assetReturn * weight;
  }
  return totalReturn;
};

export const generateSimulationData = (
  initialAmount: number,
  simulationPeriod: number,
  currentAge: number,
  selectedPortfolio?: Portfolio
): SimulationDataPoint[] => {
  const data: SimulationDataPoint[] = [];
  const portfolios = {
    ...portfolioAllocations,
    ...(selectedPortfolio && { selected: selectedPortfolio })
  };

  for (let i = 0; i <= simulationPeriod; i++) {
    const yearData: SimulationDataPoint = {
      year: i,
      age: currentAge + i,
      conservative: initialAmount,
      moderate: initialAmount,
      aggressive: initialAmount
    };

    if (selectedPortfolio) {
      yearData.selected = initialAmount;
    }

    Object.entries(portfolios).forEach(([profile, allocation]) => {
      let amount = initialAmount;
      for (let y = 0; y < i; y++) {
        const return_ = calculatePortfolioReturn(allocation);
        amount *= (1 + return_);
      }
      yearData[profile as keyof SimulationDataPoint] = Math.round(amount);
    });

    data.push(yearData);
  }

  return data;
};
