
interface MarketDataPoint {
  date: string;
  return: number;
}

export const spHistoricalData: MarketDataPoint[] = [
  { date: "12/31/28", return: 37.88 },
  { date: "12/31/29", return: -11.91 },
  { date: "12/31/30", return: -28.48 },
  { date: "12/31/31", return: -43.84 },
  { date: "12/31/32", return: -8.64 },
  { date: "12/31/33", return: 49.98 },
  { date: "12/31/34", return: -1.19 },
  { date: "12/31/35", return: 46.74 },
  { date: "12/31/36", return: 31.94 },
  { date: "12/31/37", return: -35.34 },
  { date: "12/31/38", return: 29.28 },
  { date: "12/31/39", return: -1.10 },
  { date: "12/31/40", return: -10.67 },
  { date: "12/31/41", return: -12.77 },
  { date: "12/31/42", return: 19.17 },
  { date: "12/31/43", return: 25.06 },
  { date: "12/31/44", return: 19.03 },
  { date: "12/31/45", return: 35.82 },
  { date: "12/31/46", return: -8.43 },
  { date: "12/31/47", return: 5.20 },
  { date: "12/31/48", return: 5.70 },
  { date: "12/31/49", return: 18.30 },
  { date: "12/31/50", return: 30.81 },
  { date: "12/31/51", return: 23.68 },
  { date: "12/31/52", return: 18.15 },
  { date: "12/31/53", return: -1.21 },
  { date: "12/31/54", return: 52.56 },
  { date: "12/31/55", return: 31.56 },
  { date: "12/31/56", return: 6.56 },
  { date: "12/31/57", return: -10.78 },
  { date: "12/31/58", return: 43.36 },
  { date: "12/31/59", return: 11.96 },
  { date: "12/31/60", return: 0.47 },
  { date: "12/31/61", return: 26.89 },
  { date: "12/31/62", return: -8.73 },
  { date: "12/31/63", return: 22.61 },
  { date: "12/31/64", return: 16.42 },
  { date: "12/31/65", return: 12.40 },
  { date: "12/31/66", return: -10.06 },
  { date: "12/31/67", return: 23.80 },
  { date: "12/31/68", return: 10.81 },
  { date: "12/31/69", return: -8.24 },
  { date: "12/31/70", return: 3.56 },
  { date: "12/31/71", return: 14.22 },
  { date: "12/31/72", return: 18.76 },
  { date: "12/31/73", return: -14.31 },
  { date: "12/31/74", return: -25.90 },
  { date: "12/31/75", return: 37.00 },
  { date: "12/31/76", return: 23.83 },
  { date: "12/31/77", return: -6.98 },
  { date: "12/31/78", return: 6.51 },
  { date: "12/31/79", return: 18.52 },
  { date: "12/31/80", return: 31.74 },
  { date: "12/31/81", return: -4.70 },
  { date: "12/31/82", return: 20.42 },
  { date: "12/31/83", return: 22.34 },
  { date: "12/31/84", return: 6.15 },
  { date: "12/31/85", return: 31.24 },
  { date: "12/31/86", return: 18.49 },
  { date: "12/31/87", return: 5.81 },
  { date: "12/31/88", return: 16.54 },
  { date: "12/31/89", return: 31.48 },
  { date: "12/31/90", return: -3.06 },
  { date: "12/31/91", return: 30.23 },
  { date: "12/31/92", return: 7.49 },
  { date: "12/31/93", return: 9.97 },
  { date: "12/31/94", return: 1.33 },
  { date: "12/31/95", return: 37.20 },
  { date: "12/31/96", return: 22.68 },
  { date: "12/31/97", return: 33.10 },
  { date: "12/31/98", return: 28.34 },
  { date: "12/31/99", return: 20.89 },
  { date: "12/31/00", return: -9.03 },
  { date: "12/31/01", return: -11.85 },
  { date: "12/31/02", return: -21.97 },
  { date: "12/31/03", return: 28.36 },
  { date: "12/31/04", return: 10.74 },
  { date: "12/31/05", return: 4.83 },
  { date: "12/31/06", return: 15.61 },
  { date: "12/31/07", return: 5.48 },
  { date: "12/31/08", return: -36.55 },
  { date: "12/31/09", return: 25.94 },
  { date: "12/31/10", return: 14.82 },
  { date: "12/31/11", return: 2.10 },
  { date: "12/31/12", return: 15.89 },
  { date: "12/31/13", return: 32.15 },
  { date: "12/31/14", return: 13.52 },
  { date: "12/31/15", return: 1.38 },
  { date: "12/31/16", return: 11.77 },
  { date: "12/31/17", return: 21.61 },
  { date: "12/31/18", return: -4.23 },
  { date: "12/31/19", return: 31.21 },
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
