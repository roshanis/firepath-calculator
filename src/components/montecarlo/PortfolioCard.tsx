
import { Portfolio } from "./types";

interface PortfolioCardProps {
  title: string;
  portfolio: Portfolio;
}

export function PortfolioCard({ title, portfolio }: PortfolioCardProps) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 className="text-base sm:text-lg font-medium mb-2">{title}</h3>
      <ul className="text-xs sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1">
        <li>U.S. Stocks: {(portfolio.usStocks * 100).toFixed(0)}%</li>
        <li>U.S. Bonds: {(portfolio.usBonds * 100).toFixed(0)}%</li>
        <li>Cash: {(portfolio.cash * 100).toFixed(0)}%</li>
        <li>Int'l Stocks: {(portfolio.intlStocks * 100).toFixed(0)}%</li>
        <li>Int'l Bonds: {(portfolio.intlBonds * 100).toFixed(0)}%</li>
      </ul>
    </div>
  );
}
