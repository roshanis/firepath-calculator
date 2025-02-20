import { CalculatorSidebar } from "@/components/calculator/CalculatorSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Calculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [yearsToInvest, setYearsToInvest] = useState(30);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [data, setData] = useState([]);

  const calculateReturns = () => {
    let balance = initialInvestment;
    const monthlyRate = expectedReturn / 12 / 100;
    const months = yearsToInvest * 12;
    const newData = [];

    for (let year = 0; year <= yearsToInvest; year++) {
      newData.push({
        year,
        balance: Math.round(balance),
      });

      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
      }
    }

    setData(newData);
  };

  return (
    <div className="relative min-h-screen">
      <CalculatorSidebar />
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Investment Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="initial">Initial Investment</Label>
                <Input
                  id="initial"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="monthly">Monthly Contribution</Label>
                <Input
                  id="monthly"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Years to Invest: {yearsToInvest}</Label>
                <Slider
                  value={[yearsToInvest]}
                  onValueChange={([value]) => setYearsToInvest(value)}
                  min={1}
                  max={50}
                  step={1}
                />
              </div>
              <div className="grid gap-2">
                <Label>Expected Annual Return: {expectedReturn}%</Label>
                <Slider
                  value={[expectedReturn]}
                  onValueChange={([value]) => setExpectedReturn(value)}
                  min={1}
                  max={15}
                  step={0.1}
                />
              </div>
              <Separator />
              <Button onClick={calculateReturns}>Calculate</Button>
            </div>
            {data.length > 0 && (
              <div className="mt-8">
                <LineChart width={800} height={400} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#8884d8"
                    name="Portfolio Value"
                  />
                </LineChart>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
