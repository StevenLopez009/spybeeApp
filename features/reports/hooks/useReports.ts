import { useMemo } from "react";
import dayjs from "dayjs";

import { useReportsStore } from "../store/reports.store";
import { getProcessedData } from "../selectors/reports.selector";

export function useReports() {
  const incidents = useReportsStore((state) => state.incidents);
  const dateRange = useReportsStore((state) => state.dateRange);

  const processedData = useMemo(
    () => getProcessedData(incidents, dateRange),
    [incidents, dateRange],
  );

  const chartData = useMemo(() => {
    const filtered = processedData.filtered;

    if (!filtered.length) return [];

    const [startDayjs, endDayjs] = dateRange || [null, null];

    const start =
      startDayjs ||
      dayjs(Math.min(...filtered.map((i) => new Date(i.createdAt).getTime())));

    const end = endDayjs || dayjs();

    const dates: string[] = [];
    let current = start.clone();

    while (current.isBefore(end) || current.isSame(end, "day")) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    let cumulativeBacklog = incidents.filter((i) => {
      const created = dayjs(i.createdAt);

      return created.isBefore(start) && i.status !== "closed";
    }).length;

    return dates.map((date) => {
      const created = filtered.filter((i) =>
        dayjs(i.createdAt).isSame(date, "day"),
      ).length;

      const closed = filtered.filter(
        (i) => i.status === "closed" && dayjs(i.updatedAt).isSame(date, "day"),
      ).length;

      cumulativeBacklog += created - closed;

      return {
        date: dayjs(date).format("DD/MM"),
        created,
        closed,
        backlog: Math.max(cumulativeBacklog, 0),
      };
    });
  }, [incidents, processedData.filtered, dateRange]);

  const categoryData = useMemo(() => {
    const grouped = processedData.filtered.reduce(
      (acc, incident) => {
        const category = incident.type?.name ?? "Sin categoría";

        acc[category] = (acc[category] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped).map(([category, total]) => ({
      category,
      total,
    }));
  }, [processedData.filtered]);

  return {
    processedData,
    chartData,
    categoryData,
  };
}
