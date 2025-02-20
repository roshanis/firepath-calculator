
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
import { useState } from "react";
import { MonteCarloResults } from "./MonteCarloResults";

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
});

export function MonteCarloForm() {
  const [activeTab, setActiveTab] = useState("starting-portfolio");
  const [showResults, setShowResults] = useState(false);

  const form = useForm<z.infer<typeof simulationFormSchema>>({
    resolver: zodResolver(simulationFormSchema),
    defaultValues: {
      planningType: "Multistage",
      yearsToRetirement: "20",
      glidePath: "10",
      portfolioType: "Asset Classes",
      initialAmount: "1000000",
      simulationPeriod: "30",
      taxTreatment: "Pre-tax Returns",
      simulationModel: "Historical Returns",
      useFullHistory: "Yes",
      bootstrapModel: "Single Year",
      sequenceRisk: "No Adjustments",
      inflationModel: "Historical Inflation",
      rebalancing: "Rebalance annually",
      intervals: "Defaults",
    },
  });

  function onSubmit(values: z.infer<typeof simulationFormSchema>) {
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
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Simulation Model Configuration</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simulationFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as keyof z.infer<typeof simulationFormSchema>}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.type === "select" ? (
                          <Select
                            value={formField.value}
                            onValueChange={formField.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={formField.value} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={formField.value}>
                                {formField.value}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input {...formField} type="text" />
                        )}
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="starting-portfolio">Starting Portfolio</TabsTrigger>
                <TabsTrigger value="ending-portfolio">Ending Portfolio</TabsTrigger>
                <TabsTrigger value="financial-goals">Financial Goals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="starting-portfolio" className="mt-4">
                <div className="space-y-4">
                  {[...Array(10)].map((_, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset class..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stocks">Stocks</SelectItem>
                          <SelectItem value="bonds">Bonds</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input type="number" placeholder="Allocation %" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ending-portfolio">
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Ending Portfolio Configuration
                </div>
              </TabsContent>

              <TabsContent value="financial-goals">
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Financial Goals Configuration
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center gap-4 mt-6">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Run Simulation
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowResults(false)}>
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {showResults && (
        <MonteCarloResults
          initialAmount={Number(form.getValues("initialAmount"))}
          yearsToRetirement={Number(form.getValues("yearsToRetirement"))}
          simulationPeriod={Number(form.getValues("simulationPeriod"))}
        />
      )}
    </div>
  );
}
