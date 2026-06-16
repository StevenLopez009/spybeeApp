"use client";

import { useEffect } from "react";
import { DatePicker } from "antd";

import IncidentsTable from "./IncidentTable/IncidentsTable";
import IncidentHeatMap from "./IncidentHeatMap/IncidentHeatMap";
import ActivityCalendar from "./ActivityCalendar/ActivityCalendar";
import { Incident } from "@/features/incidents/types/incidents";
import { useReportsStore } from "../store/reports.store";
import IncidentTrendChart from "./IncidentTrendChart/IncidentTrendChar";
import IncidentCategoryRadarChart from "./IncidentCategoryRadarCahrt/IncidentCategoryRadarChart";
import DashboardFilters from "./DashboardFilters/DashboardFilters";
import TeamRankingCard from "./TeamRankingCard/TeamRankingCard";
import { useReports } from "../hooks/useReports";
import MetricCard from "./MetricCard/MetricCard";
import PieChartCard from "./PieChartCard/PieChartCard";

import styles from "./ReportsClient.module.scss";

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

  const {
    processedData,
    chartData,
    categoryData,
    reportersData,
    resolversData,
    workloadData,
  } = useReports();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Incidencias</h1>

      <DashboardFilters />

      <div className={styles.filters}>
        <RangePicker
          format="DD/MM/YYYY"
          value={dateRange}
          onChange={(dates) => setDateRange(dates as [any, any] | null)}
        />
      </div>

      {/* MÉTRICAS */}
      <div className={styles.metrics}>
        <MetricCard title="Total" value={processedData.total} />
        <MetricCard title="Abiertas" value={processedData.open} />
        <MetricCard title="Cerradas" value={processedData.closed} />
        <MetricCard title="En pausa" value={processedData.paused} />
        <MetricCard
          title="Tasa de cierre"
          value={`${processedData.closureRate}%`}
        />
        <MetricCard title="Vencidas activas" value={processedData.overdue} />
      </div>

      {/* PIE CHARTS */}
      <div className={styles.pieSection}>
        <PieChartCard
          title="Incidencias por Estado"
          data={processedData.statusData}
          colors={STATUS_COLORS}
        />
        <PieChartCard
          title="Incidencias por Prioridad"
          data={processedData.priorityData}
          colors={PRIORITY_COLORS}
        />
      </div>

      {/* TREND */}
      <div className={styles.trend}>
        <IncidentTrendChart data={chartData} />
      </div>

      {/* TABLE */}
      <div className={styles.table}>
        <IncidentsTable incidents={processedData.filtered} />
      </div>

      {/* MAP + CALENDAR */}
      <div className={styles.mapCalendar}>
        <IncidentHeatMap incidents={processedData.filtered} />

        <ActivityCalendar
          incidents={processedData.filtered}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* RADAR */}
      <div className={styles.radar}>
        <IncidentCategoryRadarChart data={categoryData} />
      </div>

      {/* TEAM */}
      <div className={styles.teamSection}>
        <h2 className={styles.teamTitle}>Desempeño del equipo</h2>

        <div className={styles.teamGrid}>
          <TeamRankingCard
            title="Quién resuelve más"
            description="Incidencias cerradas"
            items={resolversData}
            color="#22C55E"
          />

          <TeamRankingCard
            title="Quién reporta más"
            description="Incidencias creadas"
            items={reportersData}
            color="#FACC15"
          />

          <TeamRankingCard
            title="Carga actual de trabajo"
            description="Incidencias abiertas"
            items={workloadData}
            color="#3B82F6"
          />
        </div>
      </div>
    </div>
  );
}
