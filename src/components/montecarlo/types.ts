
export interface Portfolio {
  usStocks: number;
  usBonds: number;
  cash: number;
  intlStocks: number;
  intlBonds: number;
}

export interface MonteCarloResultsProps {
  initialAmount: number;
  yearsToRetirement: number;
  simulationPeriod: number;
  currentAge?: number;
  selectedPortfolio?: Portfolio;
}

export interface AssetClass {
  name: string;
  meanReturn: number;
  volatility: number;
}

export interface AssetClasses {
  [key: string]: AssetClass;
}

export interface SimulationDataPoint {
  year: number;
  age: number;
  conservative: number;
  moderate: number;
  aggressive: number;
  selected?: number;
}
