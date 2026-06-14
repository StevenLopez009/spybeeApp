"use client";

import Image from "next/image";
import { useState } from "react";

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
  paused: { label: "Pausada", color: "bg-blue-100 text-blue-700" },
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
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado por
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimiento
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                  <tr key={incident.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{incident.sequenceId?.padStart(4, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {incident.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${prio.color}`}
                      >
                        {prio.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${stat.color}`}
                      >
                        {stat.label}
                      </span>
                    </td>

                    {/* Asignados */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex -space-x-2">
                        {incident.assignees
                          ?.slice(0, 3)
                          .map((assignee, idx) => (
                            <Image
                              key={idx}
                              className="w-7 h-7 rounded-full border-2 border-white object-cover"
                              src={assignee.avatarUrl}
                              alt={assignee.name}
                              width={28}
                              height={28}
                            />
                          ))}
                        {incident.assignees?.length > 3 && (
                          <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium">
                            +{incident.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Creado por */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {incident.owner?.avatarUrl ? (
                          <Image
                            className="w-7 h-7 rounded-full object-cover"
                            src={incident.owner.avatarUrl}
                            alt={incident.owner.name || "Propietario"}
                            width={28}
                            height={28}
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                            👤
                          </div>
                        )}
                        <span className="text-sm text-gray-700 truncate max-w-[140px]">
                          {incident.owner?.name || "Sin propietario"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          incident.dueDate &&
                          new Date(incident.dueDate) < new Date()
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
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
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <span className="text-sm text-gray-500">
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -
              {Math.min(currentPage * ITEMS_PER_PAGE, incidents.length)} de{" "}
              {incidents.length} incidencias
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1 ? "bg-blue-600 text-white" : "border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
