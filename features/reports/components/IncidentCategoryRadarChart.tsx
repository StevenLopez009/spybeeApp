"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface CategoryData {
  category: string;
  total: number;
}

interface Props {
  data: CategoryData[];
}

export default function IncidentCategoryRadarChart({ data }: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-6 text-lg font-semibold">
        Por categoría de incidencia
      </h3>

      <ResponsiveContainer width="100%" height={400}>
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
  );
}
