
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MonteCarloResultsProps } from "./types";
import { generateSimulationData } from "./utils";
import { portfolioAllocations } from "./constants";
import { CustomTooltip } from "./CustomTooltip";
import { PortfolioCard } from "./PortfolioCard";
import { useIsMobile } from "@/hooks/use-mobile";

export function MonteCarloResults({ 
  initialAmount, 
  yearsToRetirement, 
  simulationPeriod, 
  currentAge = 30,
  selectedPortfolio
}: MonteCarloResultsProps) {
  const data = generateSimulationData(initialAmount, simulationPeriod, currentAge, selectedPortfolio);
  const isMobile = useIsMobile();

  return (
    <div className="mt-4 sm:mt-8 space-y-4 sm:space-y-6">
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Monte Carlo Simulation Results</h2>
        <div className="h-[300px] sm:h-[500px] -mx-2 sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data}
              margin={{
                top: 20,
                right: isMobile ? 5 : 30,
                left: isMobile ? 40 : 80,
                bottom: isMobile ? 60 : 60
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="age" 
                label={{ 
                  value: 'Age', 
                  position: 'bottom', 
                  offset: isMobile ? 40 : 40
                }}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickMargin={isMobile ? 5 : 10}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                label={{ 
                  value: 'Portfolio Value', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: isMobile ? -30 : -60
                }}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickMargin={isMobile ? 5 : 10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom"
                height={isMobile ? 60 : 60}
                wrapperStyle={{
                  paddingTop: isMobile ? "20px" : "20px",
                  bottom: 0,
                  fontSize: isMobile ? "10px" : "12px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="conservative" 
                stroke="#4f46e5" 
                name="Conservative"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: isMobile ? 4 : 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="moderate" 
                stroke="#10b981" 
                name="Moderate"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: isMobile ? 4 : 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="aggressive" 
                stroke="#f59e0b" 
                name="Aggressive"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: isMobile ? 4 : 6 }}
              />
              {selectedPortfolio && (
                <Line 
                  type="monotone" 
                  dataKey="selected" 
                  stroke="#ef4444" 
                  name="Selected Portfolio"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: isMobile ? 4 : 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
