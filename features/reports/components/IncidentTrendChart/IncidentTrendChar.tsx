"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";

import styles from "./IncidentTrendChart.module.scss";

interface Props {
  data: {
    date: string;
    created: number;
    closed: number;
    backlog: number;
  }[];
}

export default function IncidentTrendChart({ data }: Props) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Tendencia de Incidencias</h3>

      <div className={styles.chartContainer}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 600, height: 400 }}
        >
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis yAxisId="left" allowDecimals={false} width={35} />
            <YAxis
              yAxisId="right"
              orientation="right"
              allowDecimals={false}
              width={35}
            />
            <Tooltip />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="created"
              name="Creadas"
              fill="#3B82F6"
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="closed"
              name="Cerradas"
              fill="#22C55E"
              yAxisId="left"
              radius={[4, 4, 0, 0]}
            />
            <Line
              dataKey="backlog"
              name="Backlog"
              type="monotone"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
              yAxisId="right"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
