"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./IncidentsTable.module.scss";

interface Incident {
  id: string;
  sequenceId: string;
  title: string;
  priority: string;
  status: string;
  owner: {
    name?: string;
    avatarUrl?: string;
  } | null;
  assignees: Array<{
    name: string;
    avatarUrl: string;
  }>;
  dueDate: string | null;
}

const priorityMap: Record<string, { label: string; color: string }> = {
  high: { label: "Alta", color: "bg-red-100 text-red-700" },
  medium: { label: "Media", color: "bg-yellow-100 text-yellow-700" },
  low: { label: "Baja", color: "bg-green-100 text-green-700" },
};

const statusMap: Record<string, { label: string; color: string }> = {
  open: { label: "Abierta", color: "bg-green-100 text-green-700" },
  closed: { label: "Cerrada", color: "bg-gray-100 text-gray-700" },
  on_pause: { label: "Pausada", color: "bg-blue-100 text-blue-700" },
};

function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return "Sin fecha";

  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - due.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

  return due < now
    ? `Vencida hace ${diffDays}d`
    : due.toLocaleDateString("es-ES");
}

export default function IncidentsTable({
  incidents,
}: {
  incidents: Incident[];
}) {
  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(incidents.length / ITEMS_PER_PAGE);

  const paginatedIncidents = incidents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getVisiblePages = () => {
    const pages = [];

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + 2);

    if (end - start < 2) {
      start = Math.max(1, end - 2);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.head}>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Título</th>
                <th className={styles.th}>Prioridad</th>
                <th className={styles.th}>Estado</th>
                <th className={styles.th}>Asignados</th>
                <th className={styles.th}>Creado por</th>
                <th className={styles.th}>Vencimiento</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {paginatedIncidents.map((incident) => {
                const prio = priorityMap[incident.priority?.toLowerCase()] || {
                  label: incident.priority || "—",
                  color: "bg-gray-100 text-gray-700",
                };
                const stat = statusMap[incident.status?.toLowerCase()] || {
                  label: incident.status || "—",
                  color: "bg-gray-100 text-gray-700",
                };

                return (
                  <tr key={incident.id} className={styles.row}>
                    <td className={`${styles.td} ${styles.id}`}>
                      #{incident.sequenceId?.padStart(4, "0")}
                    </td>

                    <td className={styles.td}>
                      <div className={styles.title}>{incident.title}</div>
                    </td>

                    <td className={styles.td}>
                      <span
                        className={`${styles.badge} ${
                          styles[incident.priority?.toLowerCase()] ??
                          styles.defaultBadge
                        }`}
                      >
                        {prio.label}
                      </span>
                    </td>

                    <td className={styles.td}>
                      <span
                        className={`${styles.badge} ${
                          styles[incident.status?.toLowerCase()] ??
                          styles.defaultBadge
                        }`}
                      >
                        {stat.label}
                      </span>
                    </td>

                    <td className={styles.td}>
                      <div className={styles.assignees}>
                        {incident.assignees
                          ?.slice(0, 3)
                          .map((assignee, idx) => (
                            <Image
                              key={idx}
                              className={styles.avatar}
                              src={assignee.avatarUrl}
                              alt={assignee.name}
                              width={28}
                              height={28}
                            />
                          ))}

                        {incident.assignees?.length > 3 && (
                          <div className={styles.avatarCounter}>
                            +{incident.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className={styles.td}>
                      <div className={styles.owner}>
                        {incident.owner?.avatarUrl ? (
                          <Image
                            className={styles.avatar}
                            src={incident.owner.avatarUrl}
                            alt={incident.owner.name || "Propietario"}
                            width={28}
                            height={28}
                          />
                        ) : (
                          <div className={styles.ownerFallback}>👤</div>
                        )}

                        <span className={styles.ownerName}>
                          {incident.owner?.name || "Sin propietario"}
                        </span>
                      </div>
                    </td>

                    <td className={styles.td}>
                      <span
                        className={`${styles.badge} ${
                          incident.dueDate &&
                          new Date(incident.dueDate) < new Date()
                            ? styles.overdue
                            : styles.defaultBadge
                        }`}
                      >
                        {formatDueDate(incident.dueDate)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={styles.footer}>
            <span className={styles.footerInfo}>
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -
              {Math.min(currentPage * ITEMS_PER_PAGE, incidents.length)} de{" "}
              {incidents.length} incidencias
            </span>

            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                ←
              </button>

              <div className={styles.pages}>
                {getVisiblePages().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`${styles.pageButton} ${
                      currentPage === page ? styles.active : ""
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
