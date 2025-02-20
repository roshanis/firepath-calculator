
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HeartPulse } from "lucide-react";

const formSchema = z.object({
  age: z.string().min(1, "Age is required").regex(/^\d+$/, "Must be a number"),
  income: z.string().min(1, "Annual income is required"),
  chronicConditions: z.string().default("0"),
  prescriptionDrugs: z.string().default("0"),
  expectedProcedures: z.string().default("0"),
});

export default function HealthcareCalculator() {
  const { toast } = useToast();
  const [estimatedCosts, setEstimatedCosts] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      income: "",
      chronicConditions: "0",
      prescriptionDrugs: "0",
      expectedProcedures: "0",
    },
  });

  function calculateHealthcareCosts(data: z.infer<typeof formSchema>) {
    const age = parseInt(data.age);
    const income = parseFloat(data.income.replace(/,/g, ""));
    const conditions = parseInt(data.chronicConditions);
    const drugs = parseInt(data.prescriptionDrugs);
    const procedures = parseInt(data.expectedProcedures);

    // Base cost calculation
    let baseCost = 4000; // Average annual premium
    
    // Age adjustment
    if (age > 50) {
      baseCost += (age - 50) * 100;
    }

    // Condition costs
    baseCost += conditions * 1200; // $1,200 per chronic condition

    // Prescription costs
    baseCost += drugs * 600; // $600 per regular prescription

    // Procedure costs
    baseCost += procedures * 2500; // $2,500 per expected procedure

    // Income-based adjustment (simple sliding scale)
    if (income > 100000) {
      baseCost *= 1.2; // 20% increase for high income
    } else if (income < 50000) {
      baseCost *= 0.8; // 20% decrease for low income
    }

    return Math.round(baseCost);
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    const costs = calculateHealthcareCosts(data);
    setEstimatedCosts(costs);
    
    toast({
      title: "Calculation Complete",
      description: "Your estimated annual healthcare costs have been calculated.",
    });
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <CardTitle>Healthcare Cost Calculator</CardTitle>
          </div>
          <CardDescription>
            Estimate your annual healthcare costs based on your age, income, and health factors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="income"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Income</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your annual income" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chronicConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Chronic Conditions</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Count conditions that require regular medical attention
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prescriptionDrugs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Regular Prescriptions</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Count medications taken regularly
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedProcedures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Medical Procedures</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Planned procedures for the next year
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Calculate Costs</Button>
            </form>
          </Form>

          {estimatedCosts !== null && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Estimated Annual Healthcare Costs</h3>
              <p className="text-3xl font-bold text-primary">
                ${estimatedCosts.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This is an estimate based on provided information. Actual costs may vary.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
