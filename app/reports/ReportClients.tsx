"use client";

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

interface Props {
  incidents: any[];
}

export default function ReportsClient({ incidents }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const STATUS_COLORS = ["#3B82F6", "#22C55E", "#F59E0B"];
  const PRIORITY_COLORS = ["#EF4444", "#F59E0B", "#22C55E"];

  const { RangePicker } = DatePicker;

  const filteredIncidents = incidents.filter((incident) => {
    if (!dateRange) return true;

    const [start, end] = dateRange;

    if (!start || !end) return true;

    const createdAt = dayjs(incident.createdAt);

    return (
      createdAt.isAfter(start.startOf("day")) &&
      createdAt.isBefore(end.endOf("day"))
    );
  });

  const overdueIncidents = filteredIncidents.filter((incident) => {
    const isActive =
      incident.status === "open" || incident.status === "on_pause";

    const hasDueDate = !!incident.dueDate;

    const isOverdue = hasDueDate && new Date(incident.dueDate) < new Date();

    return isActive && isOverdue;
  }).length;

  const totalIncidents = filteredIncidents.length;

  const openIncidents = filteredIncidents.filter(
    (incident) => incident.status === "open",
  ).length;

  const closedIncidents = filteredIncidents.filter(
    (incident) => incident.status === "closed",
  ).length;

  const pausedIncidents = filteredIncidents.filter(
    (incident) => incident.status === "on_pause",
  ).length;

  const closureRate = ((closedIncidents / totalIncidents) * 100).toFixed(1);

  const statusData = [
    {
      name: "Abiertas",
      value: openIncidents,
    },
    {
      name: "Cerradas",
      value: closedIncidents,
    },
    {
      name: "En pausa",
      value: pausedIncidents,
    },
  ];

  const highPriority = filteredIncidents.filter(
    (i) => i.priority === "high",
  ).length;

  const mediumPriority = filteredIncidents.filter(
    (i) => i.priority === "medium",
  ).length;

  const lowPriority = filteredIncidents.filter(
    (i) => i.priority === "low",
  ).length;

  const priorityData = [
    {
      name: "Alta",
      value: highPriority,
    },
    {
      name: "Media",
      value: mediumPriority,
    },
    {
      name: "Baja",
      value: lowPriority,
    },
  ];

  const chartData = useMemo(() => {
    if (filteredIncidents.length === 0) return [];

    // 1. Definir rango de fechas
    let start =
      dateRange?.[0] ||
      dayjs(
        Math.min(
          ...filteredIncidents.map((i) => new Date(i.createdAt).getTime()),
        ),
      );
    let end = dateRange?.[1] || dayjs();

    const dates = [];
    let current = start.clone();
    while (current.isBefore(end) || current.isSame(end, "day")) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    // 2. Calcular Backlog Inicial (incidencias abiertas antes del rango)
    let cumulativeBacklog = incidents.filter(
      (i) =>
        dayjs(i.createdAt).isBefore(start) &&
        (i.status !== "closed" ||
          dayjs(i.closedAt || i.updatedAt).isAfter(start)),
    ).length;

    // 3. Generar datos diarios
    return dates.map((date) => {
      const dayCreated = filteredIncidents.filter((i) =>
        dayjs(i.createdAt).isSame(date, "day"),
      ).length;
      const dayClosed = filteredIncidents.filter(
        (i) =>
          i.status === "closed" &&
          dayjs(i.closedAt || i.updatedAt).isSame(date, "day"),
      ).length;

      cumulativeBacklog += dayCreated - dayClosed;

      return {
        date: dayjs(date).format("DD/MM"),
        created: dayCreated,
        closed: dayClosed,
        backlog: cumulativeBacklog,
      };
    });
  }, [filteredIncidents, dateRange, incidents]);

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
          <p className="text-4xl font-bold">{totalIncidents}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p>Abiertas</p>
          <p className="text-4xl font-bold">{openIncidents}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p>Cerradas</p>
          <p className="text-4xl font-bold">{closedIncidents}</p>
        </div>

        <div className="rounded-xl border p-6">
          <p>En pausa</p>
          <p className="text-4xl font-bold">{pausedIncidents}</p>
        </div>

        <div className="rounded-xl border p-6">
          {" "}
          <p>Tasa de Cierre</p>{" "}
          <p className="text-4xl font-bold">{closureRate}</p>{" "}
        </div>
        <div className="rounded-xl border p-6">
          <p>Vencidas activas</p>

          <p className="text-4xl font-bold">{overdueIncidents}</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-black">
            Incidencias por Estado
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {statusData.map((entry, index) => (
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
                data={priorityData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {priorityData.map((entry, index) => (
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
      <div className="rounded-xl border bg-white p-6 mt-6 col-span-4">
        <h3 className="mb-4 text-lg font-semibold text-black">
          Tendencia de Incidencias
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" />
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
    </div>
  );
}
