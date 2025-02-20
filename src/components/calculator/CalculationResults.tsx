
import { CalculationResult } from "@/types/calculator";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { MarketComparison } from "./MarketComparison";

interface CalculationResultsProps {
  result: CalculationResult;
}

export const CalculationResults = ({ result }: CalculationResultsProps) => {
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  if (!result || !result.yearlyBreakdown || result.yearlyBreakdown.length === 0) {
    return null;
  }

  const initialInvestment = result.yearlyBreakdown[0]?.portfolioValue || 0;
  const years = result.yearlyBreakdown.length;

  return (
    <>
      <div className={`mt-8 p-4 rounded-lg ${
        result.success ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
      }`}>
        <h2 className="text-lg font-semibold mb-2">
          {result.success ? "Retirement Plan Analysis" : "Warning"}
        </h2>
        <p>{result.message}</p>
        {result.success && (
          <p className="mt-2">
            Estimated final portfolio value: ${result.finalPortfolio.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </p>
        )}
      </div>

      {initialInvestment > 0 && (
        <MarketComparison
          initialInvestment={initialInvestment}
          years={years}
          startYear={new Date().getFullYear()}
        />
      )}

      <Button
        type="button"
        variant="outline"
        className="mt-4 w-full"
        onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
      >
        {showDetailedBreakdown ? (
          <>
            Hide Detailed Breakdown
            <ChevronUp className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            Show Detailed Breakdown
            <ChevronDown className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      {showDetailedBreakdown && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-4">Yearly Breakdown</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Age</TableHead>
                  <TableHead>Portfolio Value</TableHead>
                  <TableHead>Contribution</TableHead>
                  <TableHead>SS Income</TableHead>
                  <TableHead>Withdrawal</TableHead>
                  <TableHead>Expenses (Inflated)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.yearlyBreakdown.map((year, index) => (
                  <TableRow key={index}>
                    <TableCell>{year.age}</TableCell>
                    <TableCell>
                      ${year.portfolioValue.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell>
                      ${year.contribution.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell>
                      ${year.socialSecurityIncome.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell>
                      ${year.withdrawal.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </TableCell>
                    <TableCell>
                      {year.isRetired ? (
                        `$${year.inflatedExpenses.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}`
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={year.isRetired ? "text-red-500" : "text-green-500"}>
                        {year.isRetired ? "Retired" : "Working"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};
