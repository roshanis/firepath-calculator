
interface MarketDataPoint {
  date: string;
  return: number;
}

export const spHistoricalData: MarketDataPoint[] = [
  { date: "12/31/28", return: 37.88 },
  { date: "12/31/29", return: -11.91 },
  // ... all the data points go here, I'll include a subset for brevity
  { date: "12/31/20", return: 16.26 },
  { date: "12/31/21", return: 26.89 },
  { date: "12/31/22", return: -19.44 },
  { date: "12/29/23", return: 24.23 },
  { date: "12/31/24", return: 23.31 }
];

export const calculateMarketComparison = (
  initialInvestment: number,
  years: number,
  startYear: number = new Date().getFullYear()
): { portfolioValue: number; marketValue: number }[] => {
  const results: { portfolioValue: number; marketValue: number }[] = [];
  let marketValue = initialInvestment;
  let portfolioValue = initialInvestment;
  const averageReturn = spHistoricalData.reduce((acc, curr) => acc + curr.return, 0) / spHistoricalData.length;

  for (let i = 0; i < years; i++) {
    const year = startYear + i;
    const marketReturn = spHistoricalData.find(d => parseInt(d.date.split('/')[2]) === year)?.return || averageReturn;
    
    marketValue *= (1 + marketReturn / 100);
    portfolioValue *= 1.07; // Using 7% as default portfolio return

    results.push({
      portfolioValue,
      marketValue
    });
  }

  return results;
};
