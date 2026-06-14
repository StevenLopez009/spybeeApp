"use client";

import { useEffect } from "react";
import { DatePicker } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import IncidentsTable from "./IncidentsTable";
import IncidentHeatMap from "./IncidentHeatMap";
import ActivityCalendar from "./ActivityCalendar";

import { Incident } from "@/features/incidents/types/incidents";

import { useReportsStore } from "../store/reports.store";
import { useReports } from "../hooks/useReports";
import IncidentTrendChart from "./IncidentTrendChar";
import IncidentCategoryRadarChart from "./IncidentCategoryRadarChart";

interface Props {
  incidents: Incident[];
}

const STATUS_COLORS = ["#3B82F6", "#22C55E", "#F59E0B"];
const PRIORITY_COLORS = ["#EF4444", "#F59E0B", "#22C55E"];

export default function ReportsClient({ incidents }: Props) {
  const { RangePicker } = DatePicker;

  const setIncidents = useReportsStore((state) => state.setIncidents);
  const dateRange = useReportsStore((state) => state.dateRange);
  const setDateRange = useReportsStore((state) => state.setDateRange);
  const selectedDate = useReportsStore((state) => state.selectedDate);
  const setSelectedDate = useReportsStore((state) => state.setSelectedDate);

  useEffect(() => {
    setIncidents(incidents);
  }, [incidents, setIncidents]);

  const { processedData, chartData, categoryData } = useReports();
  console.log(chartData);

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Incidencias</h1>

      <RangePicker
        format="DD/MM/YYYY"
        value={dateRange}
        onChange={(dates) => setDateRange(dates as [any, any] | null)}
      />

      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="rounded-xl border p-6">
          <p>Total</p>
          <p className="text-4xl font-bold">{processedData.total}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p>Abiertas</p>
          <p className="text-4xl font-bold">{processedData.open}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p>Cerradas</p>
          <p className="text-4xl font-bold">{processedData.closed}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p>En pausa</p>
          <p className="text-4xl font-bold">{processedData.paused}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p>Tasa de cierre</p>
          <p className="text-4xl font-bold">{processedData.closureRate}%</p>
        </div>

        <div className="rounded-xl border p-6">
          <p>Vencidas activas</p>
          <p className="text-4xl font-bold">{processedData.overdue}</p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h3 className="mb-4 text-lg text-black font-semibold">
            Incidencias por Estado
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processedData.statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {processedData.statusData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-black">
            Incidencias por Prioridad
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={processedData.priorityData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {processedData.priorityData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-6">
        <IncidentTrendChart data={chartData} />
      </div>

      <IncidentsTable incidents={processedData.filtered} />
      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <IncidentHeatMap incidents={processedData.filtered} />
        </div>
        <div className="col-span-3">
          <ActivityCalendar
            incidents={processedData.filtered}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
      </div>
      <IncidentCategoryRadarChart data={categoryData} />
    </div>
  );
}
