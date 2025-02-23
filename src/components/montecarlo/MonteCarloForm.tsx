
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { MonteCarloResults } from "./MonteCarloResults";
import { calculateRetirement } from "@/utils/calculatorUtils";
import { CalculatorFormValues } from "@/types/calculator";
import { Portfolio } from "./types";
import { toast } from "sonner";
import { UserPlus, DollarSign } from "lucide-react";

const simulationFormSchema = z.object({
  planningType: z.string(),
  yearsToRetirement: z.string(),
  glidePath: z.string(),
  portfolioType: z.string(),
  initialAmount: z.string(),
  simulationPeriod: z.string(),
  taxTreatment: z.string(),
  simulationModel: z.string(),
  useFullHistory: z.string(),
  bootstrapModel: z.string(),
  sequenceRisk: z.string(),
  inflationModel: z.string(),
  rebalancing: z.string(),
  intervals: z.string(),
  spouseContribution: z.string().optional(),
  spousePortfolioValue: z.string().optional(),
});

export function MonteCarloForm() {
  const [activeTab, setActiveTab] = useState("starting-portfolio");
  const [showResults, setShowResults] = useState(false);
  const [showSpouseFields, setShowSpouseFields] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio>({
    usStocks: 0.45,
    usBonds: 0.15,
    cash: 0.05,
    intlStocks: 0.30,
    intlBonds: 0.05
  });
  const [portfolioError, setPortfolioError] = useState<string | null>(null);

  const getRetirementData = () => {
    const savedData = localStorage.getItem('retirementCalculatorData');
    if (savedData) {
      try {
        const parsedData: CalculatorFormValues = JSON.parse(savedData);
        const calculationResult = calculateRetirement(parsedData);
        setShowSpouseFields(parsedData.maritalStatus === "married");
        return {
          initialAmount: parsedData.currentPortfolioValue?.replace(/,/g, '') || "1000000",
          yearsToRetirement: (67 - parseInt(parsedData.age)).toString() || "20",
          annualReturn: parsedData.annualReturnOnInvestment || "7",
          currentAge: parseInt(parsedData.age),
          spousePortfolioValue: parsedData.spouseIncome || "0",
        };
      } catch (error) {
        console.error('Error parsing retirement data:', error);
        return null;
      }
    }
    return null;
  };

  const retirementData = getRetirementData();

  const form = useForm<z.infer<typeof simulationFormSchema>>({
    resolver: zodResolver(simulationFormSchema),
    defaultValues: {
      planningType: "Multistage",
      yearsToRetirement: retirementData?.yearsToRetirement || "20",
      glidePath: "10",
      portfolioType: "Asset Classes",
      initialAmount: retirementData?.initialAmount || "1000000",
      simulationPeriod: "30",
      taxTreatment: "Pre-tax Returns",
      simulationModel: "Historical Returns",
      useFullHistory: "Yes",
      bootstrapModel: "Single Year",
      sequenceRisk: "No Adjustments",
      inflationModel: "Historical Inflation",
      rebalancing: "Rebalance annually",
      intervals: "Defaults",
      spouseContribution: "0",
      spousePortfolioValue: retirementData?.spousePortfolioValue || "0",
    },
  });

  useEffect(() => {
    if (retirementData) {
      toast.success("Retirement calculator data loaded successfully", {
        description: "The simulation has been pre-filled with your retirement calculator data."
      });
    }
  }, []);

  const handlePortfolioChange = (asset: keyof Portfolio, value: string) => {
    const numValue = Number(value) / 100;
    if (isNaN(numValue)) return;
    
    const newPortfolio = { ...selectedPortfolio, [asset]: numValue };
    
    // Calculate total allocation
    const total = Object.values(newPortfolio).reduce((sum, val) => sum + val, 0);
    
    if (total > 1) {
      setPortfolioError("Total allocation cannot exceed 100%");
    } else {
      setPortfolioError(null);
      setSelectedPortfolio(newPortfolio);
    }
  };

  function onSubmit(values: z.infer<typeof simulationFormSchema>) {
    const total = Object.values(selectedPortfolio).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 1) > 0.001) {
      setPortfolioError("Total allocation must equal 100%");
      return;
    }
    
    console.log(values);
    setShowResults(true);
  }

  const simulationFields = [
    { name: "planningType", label: "Planning Type", type: "select" },
    { name: "yearsToRetirement", label: "Years to Retirement", type: "input" },
    { name: "glidePath", label: "Glide Path Years", type: "input" },
    { name: "portfolioType", label: "Portfolio Type", type: "select" },
    { name: "initialAmount", label: "Initial Amount", type: "input" },
    { name: "simulationPeriod", label: "Simulation Period in Years", type: "select" },
    { name: "taxTreatment", label: "Tax Treatment", type: "select" },
    { name: "simulationModel", label: "Simulation Model", type: "select" },
    { name: "useFullHistory", label: "Use Full History", type: "select" },
    { name: "bootstrapModel", label: "Bootstrap Model", type: "select" },
    { name: "sequenceRisk", label: "Sequence of Returns Risk", type: "select" },
    { name: "inflationModel", label: "Inflation Model", type: "select" },
    { name: "rebalancing", label: "Rebalancing", type: "select" },
    { name: "intervals", label: "Intervals", type: "select" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-2">Simulation Model Configuration</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {simulationFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as keyof z.infer<typeof simulationFormSchema>}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">{field.label}</FormLabel>
                      <FormControl>
                        {field.type === "select" ? (
                          <Select
                            value={formField.value}
                            onValueChange={formField.onChange}
                          >
                            <SelectTrigger className="text-sm sm:text-base">
                              <SelectValue placeholder={formField.value} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={formField.value}>
                                {formField.value}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input {...formField} type="text" className="text-sm sm:text-base" />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}

              {showSpouseFields && (
                <>
                  <FormField
                    control={form.control}
                    name="spouseContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          Spouse Annual Contribution ($)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            className="text-sm sm:text-base"
                            placeholder="0"
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              if (!isNaN(Number(value))) {
                                field.onChange(Number(value).toLocaleString());
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spousePortfolioValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Spouse Portfolio Value ($)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            className="text-sm sm:text-base"
                            placeholder="0"
                            onChange={(e) => {
                              const value = e.target.value.replace(/,/g, '');
                              if (!isNaN(Number(value))) {
                                field.onChange(Number(value).toLocaleString());
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                <TabsTrigger value="starting-portfolio" className="text-sm sm:text-base">Starting Portfolio</TabsTrigger>
                <TabsTrigger value="ending-portfolio" className="text-sm sm:text-base">Ending Portfolio</TabsTrigger>
                <TabsTrigger value="financial-goals" className="text-sm sm:text-base">Financial Goals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="starting-portfolio" className="mt-4">
                <div className="space-y-3 sm:space-y-4">
                  {portfolioError && (
                    <div className="text-red-500 text-xs sm:text-sm font-medium">{portfolioError}</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-3">
                      <div>
                        <FormLabel className="text-sm sm:text-base">U.S. Stocks (S&P 500)</FormLabel>
                        <Input 
                          type="number" 
                          min="0"
                          max="100"
                          step="1"
                          placeholder="Allocation %" 
                          value={(selectedPortfolio.usStocks * 100).toString()}
                          onChange={(e) => handlePortfolioChange('usStocks', e.target.value)}
                          className="mt-1 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <FormLabel className="text-sm sm:text-base">U.S. Bonds</FormLabel>
                        <Input 
                          type="number" 
                          min="0"
                          max="100"
                          step="1"
                          placeholder="Allocation %" 
                          value={(selectedPortfolio.usBonds * 100).toString()}
                          onChange={(e) => handlePortfolioChange('usBonds', e.target.value)}
                          className="mt-1 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <FormLabel className="text-sm sm:text-base">Cash</FormLabel>
                        <Input 
                          type="number" 
                          min="0"
                          max="100"
                          step="1"
                          placeholder="Allocation %" 
                          value={(selectedPortfolio.cash * 100).toString()}
                          onChange={(e) => handlePortfolioChange('cash', e.target.value)}
                          className="mt-1 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <FormLabel className="text-sm sm:text-base">International Stocks</FormLabel>
                        <Input 
                          type="number" 
                          min="0"
                          max="100"
                          step="1"
                          placeholder="Allocation %" 
                          value={(selectedPortfolio.intlStocks * 100).toString()}
                          onChange={(e) => handlePortfolioChange('intlStocks', e.target.value)}
                          className="mt-1 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <FormLabel className="text-sm sm:text-base">International Bonds</FormLabel>
                        <Input 
                          type="number" 
                          min="0"
                          max="100"
                          step="1"
                          placeholder="Allocation %" 
                          value={(selectedPortfolio.intlBonds * 100).toString()}
                          onChange={(e) => handlePortfolioChange('intlBonds', e.target.value)}
                          className="mt-1 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs sm:text-sm text-gray-600">
                    Total: {(Object.values(selectedPortfolio).reduce((sum, val) => sum + val, 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ending-portfolio">
                <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm sm:text-base">
                  Ending Portfolio Configuration
                </div>
              </TabsContent>

              <TabsContent value="financial-goals">
                <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 text-sm sm:text-base">
                  Financial Goals Configuration
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm sm:text-base">
                Run Simulation
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowResults(false)} className="w-full sm:w-auto text-sm sm:text-base">
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {showResults && (
        <MonteCarloResults
          initialAmount={Number(form.getValues("initialAmount").replace(/,/g, ''))}
          yearsToRetirement={Number(form.getValues("yearsToRetirement"))}
          simulationPeriod={Number(form.getValues("simulationPeriod"))}
          currentAge={retirementData?.currentAge || 30}
          selectedPortfolio={selectedPortfolio}
        />
      )}
    </div>
  );
}
