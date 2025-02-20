
import { AssetClasses } from './types';

export const assetClasses: AssetClasses = {
  usStocks: {
    name: "U.S. Stocks (S&P 500)",
    meanReturn: 0.095,
    volatility: 0.145
  },
  usBonds: {
    name: "U.S. Bonds (Bloomberg Aggregate)",
    meanReturn: 0.045,
    volatility: 0.04
  },
  cash: {
    name: "Cash (3-month T-Bill)",
    meanReturn: 0.025,
    volatility: 0.01
  },
  intlStocks: {
    name: "International Stocks (MSCI EAFE)",
    meanReturn: 0.06,
    volatility: 0.16
  },
  intlBonds: {
    name: "International Bonds (Bloomberg Global ex-U.S.)",
    meanReturn: 0.035,
    volatility: 0.06
  }
};

export const portfolioAllocations = {
  conservative: {
    usStocks: 0.20,
    usBonds: 0.40,
    cash: 0.20,
    intlStocks: 0.10,
    intlBonds: 0.10
  },
  moderate: {
    usStocks: 0.35,
    usBonds: 0.25,
    cash: 0.10,
    intlStocks: 0.20,
    intlBonds: 0.10
  },
  aggressive: {
    usStocks: 0.45,
    usBonds: 0.15,
    cash: 0.05,
    intlStocks: 0.30,
    intlBonds: 0.05
  }
};
