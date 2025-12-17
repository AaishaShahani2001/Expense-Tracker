import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#22c55e", // Income
  "#ef4444",
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#14b8a6",
  "#eab308",
  "#64748b"
];

export default function CategoryPieChart({ transactions }) {
  /* --------------------------------------------------
     BUILD PIE DATA (MEMOIZED )
  -------------------------------------------------- */
  const data = useMemo(() => {
    const categoryMap = {};

    transactions.forEach(tx => {
      const category = tx.category;
      const amount = tx.amount;

      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }

      categoryMap[category] += amount;
    });

    return Object.keys(categoryMap).map(key => ({
      name: key,
      value: categoryMap[key]
    }));
  }, [transactions]);

  if (data.length === 0) {
    return <p style={{ textAlign: "center" }}>No data available</p>;
  }

  return (
    <div style={{ width: "100%", height: 360 }}>
      <h4 style={{ textAlign: "center", marginBottom: 10 }}>
        Category-wise Breakdown
      </h4>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            innerRadius={45}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                isAnimationActive={false} 
              />
            ))}
          </Pie>

          <Tooltip formatter={value => `Rs. ${value}`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
