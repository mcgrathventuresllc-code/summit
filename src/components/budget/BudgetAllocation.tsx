"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";
import { useBudgetStore } from "@/lib/store/use-budget-store";

const COLORS = ["#0ea5e9", "#14b8a6", "#f59e0b", "#8b5cf6", "#10b981"];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function BudgetAllocation() {
  const breakdown = useBudgetStore((s) => s.breakdown);
  const recommendations = useBudgetStore((s) => s.recommendations);
  const userRent = useBudgetStore((s) => s.userRent);
  const userGroceries = useBudgetStore((s) => s.userGroceries);
  const userLifestyle = useBudgetStore((s) => s.userLifestyle);
  const userUtilities = useBudgetStore((s) => s.userUtilities);

  if (!breakdown || !recommendations) return null;

  const rent = userRent ?? recommendations.rent.recommended;
  const groceries = userGroceries ?? recommendations.groceries.recommended;
  const lifestyle = userLifestyle ?? recommendations.lifestyle.recommended;
  const utilities = userUtilities ?? recommendations.utilities.defaultEstimate;

  const data = useMemo(
    () =>
      [
        { name: "Rent", value: rent, color: COLORS[0] },
        { name: "Groceries", value: groceries, color: COLORS[1] },
        { name: "Lifestyle", value: lifestyle, color: COLORS[2] },
        { name: "Utilities", value: utilities, color: COLORS[3] },
        {
          name: "Leftover",
          value: Math.max(0, breakdown.netMonthly - rent - groceries - lifestyle - utilities),
          color: "#f472b6",
        },
      ].filter((d) => d.value > 0),
    [breakdown.netMonthly, rent, groceries, lifestyle, utilities]
  );

  return (
    <Card>
      <h3 className="text-lg font-semibold text-zinc-100 mb-1">Budget allocation</h3>
      <p className="text-sm text-zinc-500 mb-4">
        How your net monthly income is allocated
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v) => formatCurrency(Number(v ?? 0))}
              contentStyle={{
                backgroundColor: "#fafafa",
                border: "1px solid #e4e4e7",
                borderRadius: "12px",
                color: "#18181b",
                padding: "8px 12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
            <Legend
              formatter={(value, entry) => (
                <span className="text-sm text-zinc-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
