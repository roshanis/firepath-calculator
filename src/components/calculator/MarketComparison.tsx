
import { useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { calculateMarketComparison } from "@/utils/marketData";

interface MarketComparisonProps {
  initialInvestment: number;
  years: number;
  startYear?: number;
}

export const MarketComparison = ({ initialInvestment, years, startYear }: MarketComparisonProps) => {
  const data = useMemo(() => {
    return calculateMarketComparison(initialInvestment, years, startYear).map((result, index) => ({
      year: (startYear || new Date().getFullYear()) + index,
      portfolioValue: Math.round(result.portfolioValue),
      marketValue: Math.round(result.marketValue),
    }));
  }, [initialInvestment, years, startYear]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Market Performance Comparison</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) =>
                [`$${value.toLocaleString()}`, "Portfolio Value"]
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="portfolioValue"
              name="Your Portfolio (7% Return)"
              stroke="#4f46e5"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="marketValue"
              name="Market Performance"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
