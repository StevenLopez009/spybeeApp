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
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Tendencia de Incidencias</h3>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis yAxisId="left" allowDecimals={false} />

          <YAxis yAxisId="right" orientation="right" allowDecimals={false} />

          <Tooltip />
          <Legend />

          <Bar dataKey="created" name="Creadas" fill="#3B82F6" yAxisId="left" />

          <Bar dataKey="closed" name="Cerradas" fill="#22C55E" yAxisId="left" />

          <Line
            dataKey="backlog"
            name="Backlog Acumulado"
            type="monotone"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            yAxisId="right"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
