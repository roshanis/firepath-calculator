
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonteCarloResultsProps {
  initialAmount: number;
  yearsToRetirement: number;
  simulationPeriod: number;
  currentAge?: number;  // Added currentAge prop
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
        age: currentAge + i // Add age to the data
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

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Monte Carlo Simulation Results</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="age" 
                label={{ value: 'Age', position: 'bottom' }}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                labelFormatter={(label) => `Age: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="simulation1" 
                stroke="#4f46e5" 
                name="Conservative"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="simulation2" 
                stroke="#10b981" 
                name="Moderate"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="simulation3" 
                stroke="#f59e0b" 
                name="Aggressive"
                strokeWidth={2}
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
