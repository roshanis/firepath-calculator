
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Calculator from "@/pages/Calculator";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import HealthcareCalculator from "@/pages/HealthcareCalculator";
import MonteCarloSimulation from "@/pages/MonteCarloSimulation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/healthcare-calculator" element={<HealthcareCalculator />} />
        <Route path="/monte-carlo" element={<MonteCarloSimulation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
