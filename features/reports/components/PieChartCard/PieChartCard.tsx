"use client";

import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend } from "recharts";
import styles from "./PieChartCard.module.scss";

interface ChartData {
  name: string;
  value: number;
}

interface Props {
  title: string;
  data: ChartData[];
  colors: string[];
}

export default function PieChartCard({ title, data, colors }: Props) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      <div className={styles.chartContainer}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 400, height: 300 }}
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius="50%"
              label
            />

            <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
