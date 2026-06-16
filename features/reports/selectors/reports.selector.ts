import dayjs from "dayjs";
import { Incident } from "@/features/incidents/types/incidents";

export function getProcessedData(incidents: Incident[], dateRange: any) {
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
    if (i.status === "open") open++;
    else if (i.status === "closed") closed++;
    else if (i.status === "on_pause") paused++;

    if (i.priority === "high") high++;
    else if (i.priority === "medium") medium++;
    else if (i.priority === "low") low++;

    const isActive = i.status === "open" || i.status === "on_pause";

    const isOverdue = i.dueDate && new Date(i.dueDate) < new Date() && isActive;

    if (isOverdue) overdue++;
  });

  return {
    filtered,
    total: filtered.length,
    open,
    closed,
    paused,
    overdue,
    closureRate:
      filtered.length > 0 ? ((closed / filtered.length) * 100).toFixed(1) : "0",

    statusData: [
      { name: "Abiertas", value: open },
      { name: "Cerradas", value: closed },
      { name: "En pausa", value: paused },
    ],

    priorityData: [
      { name: "Alta", value: high },
      { name: "Media", value: medium },
      { name: "Baja", value: low },
    ],
  };
}

export function getTopReporters(incidents: Incident[]) {
  const grouped = incidents.reduce(
    (acc, incident) => {
      const owner = incident.owner;

      if (!owner) return acc;

      if (!acc[owner.id]) {
        acc[owner.id] = {
          id: owner.id,
          name: owner.name,
          avatar: owner.avatarUrl,
          value: 0,
        };
      }

      acc[owner.id].value++;

      return acc;
    },
    {} as Record<string, any>,
  );

  return Object.values(grouped)
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5);
}

export function getTopResolvers(incidents: Incident[]) {
  const grouped = incidents
    .filter((i) => i.status === "closed")
    .reduce(
      (acc, incident) => {
        incident.assignees?.forEach((assignee) => {
          if (!acc[assignee.id]) {
            acc[assignee.id] = {
              id: assignee.id,
              name: assignee.name,
              avatar: assignee.avatarUrl,
              value: 0,
            };
          }

          acc[assignee.id].value++;
        });

        return acc;
      },
      {} as Record<string, any>,
    );

  return Object.values(grouped)
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5);
}

export function getCurrentWorkload(incidents: Incident[]) {
  const grouped = incidents
    .filter((i) => i.status !== "closed")
    .reduce(
      (acc, incident) => {
        incident.assignees?.forEach((assignee) => {
          if (!acc[assignee.id]) {
            acc[assignee.id] = {
              id: assignee.id,
              name: assignee.name,
              avatar: assignee.avatarUrl,
              value: 0,
            };
          }

          acc[assignee.id].value++;
        });

        return acc;
      },
      {} as Record<string, any>,
    );

  return Object.values(grouped)
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5);
}
