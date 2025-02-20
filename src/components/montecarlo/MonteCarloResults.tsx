
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MonteCarloResultsProps } from "./types";
import { generateSimulationData } from "./utils";
import { portfolioAllocations } from "./constants";
import { CustomTooltip } from "./CustomTooltip";
import { PortfolioCard } from "./PortfolioCard";

export function MonteCarloResults({ 
  initialAmount, 
  yearsToRetirement, 
  simulationPeriod, 
  currentAge = 30,
  selectedPortfolio
}: MonteCarloResultsProps) {
  const data = generateSimulationData(initialAmount, simulationPeriod, currentAge, selectedPortfolio);

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Monte Carlo Simulation Results</h2>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 80,
                bottom: 60
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="age" 
                label={{ 
                  value: 'Age', 
                  position: 'bottom', 
                  offset: 40
                }}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                label={{ 
                  value: 'Portfolio Value', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: -60
                }}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom"
                height={60}
                wrapperStyle={{
                  paddingTop: "20px",
                  bottom: 0
                }}
              />
              <Line 
                type="monotone" 
                dataKey="conservative" 
                stroke="#4f46e5" 
                name="Conservative"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="moderate" 
                stroke="#10b981" 
                name="Moderate"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="aggressive" 
                stroke="#f59e0b" 
                name="Aggressive"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              {selectedPortfolio && (
                <Line 
                  type="monotone" 
                  dataKey="selected" 
                  stroke="#ef4444" 
                  name="Selected Portfolio"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PortfolioCard title="Conservative Portfolio" portfolio={portfolioAllocations.conservative} />
        <PortfolioCard title="Moderate Portfolio" portfolio={portfolioAllocations.moderate} />
        <PortfolioCard title="Aggressive Portfolio" portfolio={portfolioAllocations.aggressive} />
        {selectedPortfolio && (
          <PortfolioCard title="Selected Portfolio" portfolio={selectedPortfolio} />
        )}
      </div>
    </div>
  );
}
