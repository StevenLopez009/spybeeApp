"use client";

import { useEffect, useState } from "react";
import { ReactNode } from "react";
import styles from "./IncidentSideBar.module.scss";
import { IncidentData } from "../../types";

interface IncidentSidebarProps {
  incident: IncidentData;
  onClose: () => void;
}

const priorityColor: Record<string, string> = {
  Urgente: styles.badgeUrgente,
  Alta: styles.badgeAlta,
  Media: styles.badgeMedia,
  Baja: styles.badgeBaja,
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className={styles.fieldLabel}>{label}</p>
      <div className={styles.fieldContent}>{children}</div>
    </div>
  );
}

export default function IncidentSidebar({
  incident,
  onClose,
}: IncidentSidebarProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

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

  const handleClose = () => {
    setOpen(false);
    setTimeout(onClose, 300);
  };

  return (
    <aside
      className={`${styles.aside} ${
        open ? styles.asideOpen : styles.asideClosed
      }`}
    >
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Detalle de la incidencia</h2>
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      <div className={styles.body}>
        <div>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{incident.title || "(Sin título)"}</h3>
            <span
              className={`${styles.badge} ${
                priorityColor[incident.priority] ?? styles.badgeDefault
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
          <p className={styles.description}>{incident.description || "—"}</p>
        </Field>

        <Field label="Piso / Nivel">
          {incident.tags.length > 0 ? (
            <div className={styles.tags}>
              {incident.tags.map((t) => (
                <span key={t} className={styles.tag}>
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
            <ul className={styles.assignees}>
              {incident.assignees.map((a, i) => (
                <li key={`${a.name}-${i}`}>
                  <span className={styles.assigneeName}>{a.name}</span>
                  <span className={styles.assigneeRole}> — {a.role}</span>
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
        <div className={styles.locationBox}>
          <p className={styles.locationLabel}>Ubicación</p>
          <p className={styles.locationAddress}>{incident.address || "—"}</p>
          {incident.locationDetails && (
            <p className={styles.locationDetails}>{incident.locationDetails}</p>
          )}
          <div className={styles.coordGrid}>
            <div className={styles.coordBox}>
              <span className={styles.coordLabel}>Latitud</span>
              <span className={styles.coordValue}>
                {incident.coordinates.lat.toFixed(6)}
              </span>
            </div>
            <div className={styles.coordBox}>
              <span className={styles.coordLabel}>Longitud</span>
              <span className={styles.coordValue}>
                {incident.coordinates.lng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <Field label="Imágenes">
          {imageUrls.length > 0 ? (
            <div className={styles.imageGrid}>
              {imageUrls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt={`Imagen ${i + 1}`}
                  className={styles.image}
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
