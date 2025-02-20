
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { calculateMarketComparison } from "@/utils/marketData";

interface MarketComparisonProps {
  initialInvestment: number;
  years: number;
  startYear: number;
}

export const MarketComparison = ({ initialInvestment, years, startYear }: MarketComparisonProps) => {
  const data = calculateMarketComparison(initialInvestment, years, startYear);
  
  const formattedData = data.map((point, index) => ({
    year: startYear + index,
    Portfolio: point.portfolioValue,
    "S&P 500": point.marketValue,
  }));

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Portfolio vs S&P 500 Historical Comparison</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
            <Tooltip 
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Portfolio"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="S&P 500"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
