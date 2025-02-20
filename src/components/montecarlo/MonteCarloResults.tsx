
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonteCarloResultsProps {
  initialAmount: number;
  yearsToRetirement: number;
  simulationPeriod: number;
  currentAge?: number;
}

export function MonteCarloResults({ initialAmount, yearsToRetirement, simulationPeriod, currentAge = 30 }: MonteCarloResultsProps) {
  // Asset class definitions with historical returns and volatility
  const assetClasses = {
    usStocks: {
      name: "U.S. Stocks (S&P 500)",
      meanReturn: 0.10,  // 10% historical average
      volatility: 0.15   // 15% standard deviation
    },
    usBonds: {
      name: "U.S. Bonds (Bloomberg Aggregate)",
      meanReturn: 0.05,  // 5% historical average
      volatility: 0.05   // 5% standard deviation
    },
    cash: {
      name: "Cash (3-month T-Bill)",
      meanReturn: 0.03,  // 3% historical average
      volatility: 0.01   // 1% standard deviation
    },
    intlStocks: {
      name: "International Stocks (MSCI EAFE)",
      meanReturn: 0.09,  // 9% historical average
      volatility: 0.17   // 17% standard deviation
    },
    intlBonds: {
      name: "International Bonds (Bloomberg Global ex-U.S.)",
      meanReturn: 0.04,  // 4% historical average
      volatility: 0.07   // 7% standard deviation
    }
  };

  // Portfolio allocations for different risk profiles
  const portfolios = {
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

  // Generate sample data using Monte Carlo simulation
  const generateSimulationData = () => {
    const data = [];
    const numSimulations = 1000;

    // Helper function to generate random normal distribution
    const generateNormalRandom = (mean: number, stdDev: number) => {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      return mean + stdDev * z;
    };

    // Calculate portfolio return based on allocation
    const calculatePortfolioReturn = (allocation: typeof portfolios.conservative) => {
      let totalReturn = 0;
      for (const [asset, weight] of Object.entries(allocation)) {
        const assetClass = assetClasses[asset as keyof typeof assetClasses];
        const assetReturn = generateNormalRandom(assetClass.meanReturn, assetClass.volatility);
        totalReturn += assetReturn * weight;
      }
      return totalReturn;
    };

    for (let i = 0; i <= simulationPeriod; i++) {
      const yearData: any = { 
        year: i,
        age: currentAge + i
      };
      
      // Generate portfolio values for each risk profile
      Object.entries(portfolios).forEach(([profile, allocation]) => {
        let amount = initialAmount;
        for (let y = 0; y < i; y++) {
          const return_ = calculatePortfolioReturn(allocation);
          amount *= (1 + return_);
        }
        yearData[profile] = Math.round(amount);
      });
      
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
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Conservative Portfolio</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>U.S. Stocks: 20%</li>
            <li>U.S. Bonds: 40%</li>
            <li>Cash: 20%</li>
            <li>Int'l Stocks: 10%</li>
            <li>Int'l Bonds: 10%</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Moderate Portfolio</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>U.S. Stocks: 35%</li>
            <li>U.S. Bonds: 25%</li>
            <li>Cash: 10%</li>
            <li>Int'l Stocks: 20%</li>
            <li>Int'l Bonds: 10%</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Aggressive Portfolio</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>U.S. Stocks: 45%</li>
            <li>U.S. Bonds: 15%</li>
            <li>Cash: 5%</li>
            <li>Int'l Stocks: 30%</li>
            <li>Int'l Bonds: 5%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
