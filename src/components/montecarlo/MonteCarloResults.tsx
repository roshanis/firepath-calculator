
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonteCarloResultsProps {
  initialAmount: number;
  yearsToRetirement: number;
  simulationPeriod: number;
  currentAge?: number;
}

export function MonteCarloResults({ initialAmount, yearsToRetirement, simulationPeriod, currentAge = 30 }: MonteCarloResultsProps) {
  // Generate sample data for visualization
  const generateSimulationData = () => {
    const data = [];
    const numSimulations = 1000;
    const returns = [0.04, 0.06, 0.08, 0.10, 0.12]; // Sample returns

    for (let i = 0; i <= simulationPeriod; i++) {
      const yearData: any = { 
        year: i,
        age: currentAge + i
      };
      
      // Generate multiple paths
      for (let sim = 1; sim <= 3; sim++) {
        let amount = initialAmount;
        for (let y = 0; y < i; y++) {
          const randomReturn = returns[Math.floor(Math.random() * returns.length)];
          amount *= (1 + randomReturn);
        }
        yearData[`simulation${sim}`] = Math.round(amount);
      }
      
      data.push(yearData);
    }
    return data;
  };

  const data = generateSimulationData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">Age: {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Monte Carlo Simulation Results</h2>
        <div className="h-[500px]"> {/* Increased height for better visibility */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 80, // Increased left margin for Y-axis labels
                bottom: 60 // Increased bottom margin for X-axis labels
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="age" 
                label={{ 
                  value: 'Age', 
                  position: 'bottom', 
                  offset: 40 // Increased offset for better spacing
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
                  offset: -60 // Adjusted offset for better positioning
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
                dataKey="simulation1" 
                stroke="#4f46e5" 
                name="Conservative"
                strokeWidth={2}
                dot={false} // Removes dots for cleaner lines
                activeDot={{ r: 6 }} // Larger dots on hover
              />
              <Line 
                type="monotone" 
                dataKey="simulation2" 
                stroke="#10b981" 
                name="Moderate"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="simulation3" 
                stroke="#f59e0b" 
                name="Aggressive"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-green-600">95%</p>
          <p className="text-sm text-gray-500 mt-1">Probability of meeting goals</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Median Outcome</h3>
          <p className="text-3xl font-bold text-blue-600">$2.5M</p>
          <p className="text-sm text-gray-500 mt-1">Expected portfolio value</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Worst Case</h3>
          <p className="text-3xl font-bold text-yellow-600">$1.2M</p>
          <p className="text-sm text-gray-500 mt-1">5th percentile outcome</p>
        </div>
      </div>
    </div>
  );
}
