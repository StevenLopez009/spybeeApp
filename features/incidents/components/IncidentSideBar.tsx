"use client";

import { useEffect, useState } from "react";
import { IncidentData } from "../types";

interface IncidentSidebarProps {
  incident: IncidentData;
  onClose: () => void;
}

const priorityColor: Record<string, string> = {
  Urgente: "bg-red-500",
  Alta: "bg-orange-500",
  Media: "bg-yellow-500",
  Baja: "bg-green-500",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <div className="mt-1 text-sm text-gray-800">{children}</div>
    </div>
  );
}

export default function IncidentSidebar({
  incident,
  onClose,
}: IncidentSidebarProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // Anima la entrada desde la derecha al montar
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!incident.images || incident.images.length === 0) {
      setImageUrls([]);
      return;
    }
    const urls = incident.images.map((f) => URL.createObjectURL(f));
    setImageUrls(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [incident]);

  // Anima la salida antes de desmontar
  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <aside
      className={`fixed top-0 right-0 z-50 h-full w-full max-w-[440px] overflow-y-auto border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4">
        <h2 className="text-lg font-bold text-gray-800">
          Detalle de la incidencia
        </h2>
        <button
          onClick={handleClose}
          className="text-2xl font-bold text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      <div className="space-y-5 p-5">
        {/* Título + prioridad */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold text-gray-900">
              {incident.title || "(Sin título)"}
            </h3>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                priorityColor[incident.priority] ?? "bg-gray-400"
              }`}
            >
              {incident.priority}
            </span>
          </div>
        </div>

        <Field label="Categoría">{incident.category || "—"}</Field>

        <Field label="Fecha de vencimiento">
          {incident.dueDate || "Sin fecha"}
        </Field>

        <Field label="Descripción">
          <p className="whitespace-pre-wrap">{incident.description || "—"}</p>
        </Field>

        <Field label="Piso / Nivel">
          {incident.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {incident.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            "—"
          )}
        </Field>

        <Field label="Asignados">
          {incident.assignees.length > 0 ? (
            <ul className="space-y-1">
              {incident.assignees.map((a, i) => (
                <li key={`${a.name}-${i}`}>
                  <span className="font-medium">{a.name}</span>
                  <span className="text-gray-500"> — {a.role}</span>
                </li>
              ))}
            </ul>
          ) : (
            "—"
          )}
        </Field>

        <Field label="Observación realizada por">
          {incident.observer || "—"}
        </Field>

        {/* Ubicación */}
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Ubicación
          </p>
          <p className="text-sm text-gray-800">{incident.address || "—"}</p>
          {incident.locationDetails && (
            <p className="mt-1 text-sm text-gray-600">
              {incident.locationDetails}
            </p>
          )}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded bg-white px-3 py-2 border border-gray-200">
              <span className="block text-xs text-gray-400">Latitud</span>
              <span className="font-mono text-sm text-gray-800">
                {incident.coordinates.lat.toFixed(6)}
              </span>
            </div>
            <div className="rounded bg-white px-3 py-2 border border-gray-200">
              <span className="block text-xs text-gray-400">Longitud</span>
              <span className="font-mono text-sm text-gray-800">
                {incident.coordinates.lng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <Field label="Imágenes">
          {imageUrls.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {imageUrls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt={`Imagen ${i + 1}`}
                  className="h-20 w-full rounded-lg border border-gray-200 object-cover"
                />
              ))}
            </div>
          ) : (
            "Sin imágenes"
          )}
        </Field>
      </div>
    </aside>
  );
}
