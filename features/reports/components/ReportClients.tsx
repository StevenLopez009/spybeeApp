"use client";

import { Incident } from "@/features/incidents/types/incidents";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import IncidentsTable from "./IncidentsTable";
import IncidentHeatMap from "./IncidentHeatMap";
import ActivityCalendar from "./ActivityCalendar";
import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  incidents: Incident[];
}

export default function ReportsClient({ incidents }: Props) {
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { RangePicker } = DatePicker;

  const processedData = useMemo(() => {
    const [start, end] = dateRange || [null, null];

    const filtered = incidents.filter((incident) => {
      if (!start || !end) return true;

      const createdAt = dayjs(incident.createdAt);
      return (
        createdAt.isAfter(start.startOf("day")) &&
        createdAt.isBefore(end.endOf("day"))
      );
    });

    let open = 0;
    let closed = 0;
    let paused = 0;
    let high = 0;
    let medium = 0;
    let low = 0;
    let overdue = 0;

    filtered.forEach((i) => {
      // Status
      if (i.status === "open") open++;
      else if (i.status === "closed") closed++;
      else if (i.status === "on_pause") paused++;

      // Priority
      if (i.priority === "high") high++;
      else if (i.priority === "medium") medium++;
      else if (i.priority === "low") low++;

      // Overdue
      const isActive = i.status === "open" || i.status === "on_pause";
      const hasDueDate = !!i.dueDate;
      const isOverdue =
        hasDueDate && new Date(i.dueDate) < new Date() && isActive;
      if (isOverdue) overdue++;
    });

    const total = filtered.length;
    const closureRate = total > 0 ? ((closed / total) * 100).toFixed(1) : "0";

    const statusData = [
      { name: "Abiertas", value: open },
      { name: "Cerradas", value: closed },
      { name: "En pausa", value: paused },
    ];

    const priorityData = [
      { name: "Alta", value: high },
      { name: "Media", value: medium },
      { name: "Baja", value: low },
    ];

    return {
      filtered,
      total,
      open,
      closed,
      paused,
      overdue,
      closureRate,
      statusData,
      priorityData,
    };
  }, [incidents, dateRange]);

  const chartData = useMemo(() => {
    const { filtered } = processedData;
    if (filtered.length === 0) return [];

    const [startDayjs, endDayjs] = dateRange || [null, null];

    let start =
      startDayjs ||
      dayjs(Math.min(...filtered.map((i) => new Date(i.createdAt).getTime())));
    let end = endDayjs || dayjs();

    const dates: string[] = [];
    let current = start.clone();
    while (current.isBefore(end) || current.isSame(end, "day")) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    // Backlog
    let cumulativeBacklog = incidents.filter((i) => {
      const created = dayjs(i.createdAt);
      const closedAt = i.closedAt || i.updatedAt;
      return (
        created.isBefore(start) &&
        (!i.status || i.status !== "closed" || dayjs(closedAt).isAfter(start))
      );
    }).length;

    return dates.map((date) => {
      const dayCreated = filtered.filter((i) =>
        dayjs(i.createdAt).isSame(date, "day"),
      ).length;

      const dayClosed = filtered.filter(
        (i) =>
          i.status === "closed" &&
          dayjs(i.closedAt || i.updatedAt).isSame(date, "day"),
      ).length;

      cumulativeBacklog += dayCreated - dayClosed;

      return {
        date: dayjs(date).format("DD/MM"),
        created: dayCreated,
        closed: dayClosed,
        backlog: Math.max(0, cumulativeBacklog),
      };
    });
  }, [processedData.filtered, dateRange, incidents]);

  const STATUS_COLORS = ["#3B82F6", "#22C55E", "#F59E0B"];
  const PRIORITY_COLORS = ["#EF4444", "#F59E0B", "#22C55E"];

  return (
    <div className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Incidencias</h1>

      <RangePicker
        format="DD/MM/YYYY"
        onChange={(dates) => {
          setDateRange(dates as [Dayjs | null, Dayjs | null]);
        }}
      />

      <div className="grid grid-cols-4 gap-4">
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
          <p>Tasa de Cierre</p>
          <p className="text-4xl font-bold">{processedData.closureRate}</p>
        </div>
        <div className="rounded-xl border p-6">
          <p>Vencidas activas</p>

          <p className="text-4xl font-bold">{processedData.overdue}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-black">
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
                {processedData.statusData.map((entry, index) => (
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
      <div className="mt-6 rounded-xl border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Tendencia de Incidencias</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="created"
              name="Creadas"
              fill="#3B82F6"
              yAxisId="left"
            />
            <Bar
              dataKey="closed"
              name="Cerradas"
              fill="#22C55E"
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="backlog"
              name="Backlog Acumulado"
              stroke="#EF4444"
              strokeWidth={3}
              yAxisId="right"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <IncidentsTable incidents={incidents} />
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
    </div>
  );
}
