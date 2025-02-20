
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, PiggyBank, TrendingUp, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="section-padding">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center rounded-full px-4 py-1 text-xs sm:text-sm font-medium bg-emerald-50 text-emerald-700">
              Version 1.0 Launch
            </span>
            
            <h1 className="mt-6 sm:mt-8 text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
              Plan Your Financial Independence
            </h1>
            
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 max-w-2xl mx-auto">
              Test your retirement plan against every market scenario since 1871. Make informed decisions about your financial future with historical data.
            </p>

            <div className="mt-6 sm:mt-10 flex items-center justify-center gap-x-4 sm:gap-x-6">
              <Button size="lg" asChild className="rounded-full text-sm sm:text-base">
                <Link to="/calculator" className="inline-flex items-center">
                  Start Calculating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="mt-16 sm:mt-32 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 px-4 sm:px-6"
            >
              {features.map((feature, index) => (
                <div
                  key={feature.name}
                  className="glass rounded-2xl p-6 sm:p-8 text-left card-hover"
                >
                  <div className="mb-4 sm:mb-5">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-gray-600">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

const features = [
  {
    name: "Historical Analysis",
    description:
      "Analyze your retirement plan against real market data going back to 1871, providing a comprehensive view of possible outcomes.",
    icon: LineChart,
  },
  {
    name: "Smart Planning",
    description:
      "Input your portfolio size, desired spending, and timeframe to see success rates and potential adjustments needed.",
    icon: PiggyBank,
  },
  {
    name: "Dynamic Results",
    description:
      "View interactive charts and detailed analysis of your retirement plan's performance across different market conditions.",
    icon: TrendingUp,
  },
];

export default Index;
