"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import styles from "./IncidentCategoryRadarChart.module.scss";

interface CategoryData {
  category: string;
  total: number;
}

interface Props {
  data: CategoryData[];
}

export default function IncidentCategoryRadarChart({ data }: Props) {
  return (
    <div className={styles.chart}>
      <h3 className={styles.chart__title}>Por categoría de incidencia</h3>

      <div className={styles.chart__container}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{ width: 500, height: 400 }}
        >
          <RadarChart data={data}>
            <PolarGrid />

            <PolarAngleAxis
              dataKey="category"
              tick={{
                fontSize: 14,
                fill: "#525252",
              }}
            />

            <PolarRadiusAxis
              angle={30}
              domain={[0, "auto"]}
              tick={{
                fontSize: 12,
                fill: "#6b7280",
              }}
            />

            <Radar
              name="Incidencias"
              dataKey="total"
              stroke="#F5B700"
              fill="#F5B700"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
