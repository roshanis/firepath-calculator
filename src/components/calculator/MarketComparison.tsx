
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
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
  }));

  // Create histogram data by grouping portfolio values into ranges
  const histogramData = formattedData.reduce((acc: any[], curr) => {
    const value = curr.Portfolio;
    const range = Math.floor(value / 1000000) * 1000000; // Group by millions
    const existingRange = acc.find(item => item.range === range);
    
    if (existingRange) {
      existingRange.count += 1;
    } else {
      acc.push({ range, count: 1, label: `$${(range / 1000000)}M-${(range / 1000000 + 1)}M` });
    }
    
    return acc;
  }, []).sort((a, b) => a.range - b.range);

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Portfolio Growth Over Time</h3>
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
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Portfolio Value Distribution</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={histogramData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [`${value} years`, 'Frequency']}
                labelFormatter={(label) => `Range: ${label}`}
              />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
