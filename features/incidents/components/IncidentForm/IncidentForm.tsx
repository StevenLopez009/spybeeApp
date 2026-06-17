"use client";

import { useState } from "react";
import {
  IncidentData,
  Assignee,
  PRIORITIES,
  DEFAULT_LEVELS,
} from "../../types";

import styles from "./IncidentForm.module.scss";
import { useCategories } from "../../hooks/useCategories";
import CategoryManager from "../CategoryManager/CategoryManager";

interface IncidentFormProps {
  coordinates: {
    lng: number;
    lat: number;
  };
  address?: string;
  onClose: () => void;
  onSubmit: (data: IncidentData) => void;
}

const PRIORITY_CLASS: Record<string, string> = {
  Urgente: styles.priorityUrgente,
  Alta: styles.priorityAlta,
  Media: styles.priorityMedia,
  Baja: styles.priorityBaja,
};

export default function IncidentForm({
  coordinates,
  address,
  onClose,
  onSubmit,
}: IncidentFormProps) {
  const { categories, addCategory, updateCategory, removeCategory } =
    useCategories();

  const [formData, setFormData] = useState<IncidentData>({
    title: "",
    description: "",
    category: "",
    priority: "Media",
    dueDate: "",
    tags: [],
    assignees: [],
    observer: "",
    coordinates,
    address,
    locationDetails: "",
  });

  const [managingCategories, setManagingCategories] = useState(false);
  const [levels, setLevels] = useState<string[]>([...DEFAULT_LEVELS]);
  const [newLevel, setNewLevel] = useState("");
  const [assigneeDraft, setAssigneeDraft] = useState<Assignee>({
    id: "",
    name: "",
    email: "",
  });

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const addLevel = () => {
    const trimmed = newLevel.trim();
    if (!trimmed) return;
    if (!levels.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
      setLevels((prev) => [...prev, trimmed]);
    }
    if (!formData.tags.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setNewLevel("");
  };

  const addAssignee = () => {
    if (!assigneeDraft.name.trim()) return;

    setFormData((prev) => ({
      ...prev,
      assignees: [
        ...prev.assignees,
        {
          id: crypto.randomUUID(),
          name: assigneeDraft.name.trim(),
          email: assigneeDraft.email.trim(),
        },
      ],
    }));

    setAssigneeDraft({
      id: "",
      name: "",
      email: "",
    });
  };

  const removeAssignee = (index: number) => {
    setFormData((prev) => {
      const removed = prev.assignees[index];
      return {
        ...prev,
        assignees: prev.assignees.filter((_, i) => i !== index),
        observer: prev.observer === removed?.name ? "" : prev.observer,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nueva Incidencia</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Ubicación */}
          <div className={styles.locationBox}>
            <h3 className={styles.locationHeading}>📍 Ubicación</h3>
            <p className={styles.locationAddress}>
              {address || "Cargando dirección..."}
            </p>
            <div className={styles.coordGrid}>
              <div className={styles.coordCell}>
                <span className={styles.coordLabel}>Latitud</span>
                <span className={styles.coordValue}>
                  {coordinates.lat.toFixed(6)}
                </span>
              </div>
              <div className={styles.coordCell}>
                <span className={styles.coordLabel}>Longitud</span>
                <span className={styles.coordValue}>
                  {coordinates.lng.toFixed(6)}
                </span>
              </div>
            </div>

            {/* Detalles de la localización */}
            <div className={styles.locationDetailsWrap}>
              <label className={styles.labelTight}>
                Detalles de la localización
              </label>
              <textarea
                value={formData.locationDetails}
                onChange={(e) =>
                  setFormData({ ...formData, locationDetails: e.target.value })
                }
                placeholder="Ej: junto a la recepción, pasillo norte, frente al ascensor..."
                rows={2}
                className={`${styles.field} ${styles.textarea}`}
              />
            </div>
          </div>

          {/* Título */}
          <div>
            <label className={styles.label}>Título de la incidencia *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ej: Bache en la calzada"
              className={styles.field}
            />
          </div>

          {/* Categoría + gestión */}
          <div>
            <div className={styles.categoryHeader}>
              <label className={styles.label} style={{ marginBottom: 0 }}>
                Categoría *
              </label>
              <button
                type="button"
                onClick={() => setManagingCategories((v) => !v)}
                className={styles.manageButton}
              >
                {managingCategories
                  ? "Cerrar gestión"
                  : "⚙ Gestionar categorías"}
              </button>
            </div>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`${styles.field} ${styles.select}`}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {managingCategories && (
              <CategoryManager
                categories={categories}
                onAdd={addCategory}
                onUpdate={updateCategory}
                onRemove={removeCategory}
              />
            )}
          </div>

          {/* Prioridad */}
          <div>
            <label className={styles.label}>Prioridad</label>
            <div className={styles.priorityGroup}>
              {PRIORITIES.map((priority) => {
                const selected = formData.priority === priority;
                return (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={`${styles.priorityButton} ${
                      selected
                        ? `${styles.prioritySelected} ${PRIORITY_CLASS[priority]}`
                        : ""
                    }`}
                  >
                    {priority}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fecha de vencimiento */}
          <div>
            <label className={styles.label}>Fecha de vencimiento</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className={styles.field}
            />
          </div>

          {/* Etiquetas: pisos / niveles */}
          <div>
            <label className={styles.label}>Piso / Nivel (etiquetas)</label>
            <div className={styles.tagList}>
              {levels.map((level) => {
                const selected = formData.tags.includes(level);
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleTag(level)}
                    className={`${styles.tagButton} ${
                      selected ? styles.tagButtonSelected : ""
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
            <div className={styles.addLevelRow}>
              <input
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLevel();
                  }
                }}
                placeholder="Agregar otro nivel (ej: Mezzanine)"
                className={styles.smallField}
              />
              <button
                type="button"
                onClick={addLevel}
                className={styles.grayButton}
              >
                Añadir
              </button>
            </div>
          </div>

          {/* Asignados */}
          <div>
            <label className={styles.label}>Asignados</label>

            {formData.assignees.length > 0 && (
              <ul className={styles.assigneeList}>
                {formData.assignees.map((a, i) => (
                  <li key={`${a.name}-${i}`} className={styles.assigneeItem}>
                    <span className={styles.assigneeText}>
                      <span className={styles.assigneeName}>{a.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAssignee(i)}
                      className={styles.removeButton}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.assigneeForm}>
              <input
                value={assigneeDraft.name}
                onChange={(e) =>
                  setAssigneeDraft({ ...assigneeDraft, name: e.target.value })
                }
                placeholder="Nombre"
                className={styles.assigneeField}
              />
              <button
                type="button"
                onClick={addAssignee}
                className={styles.amberButton}
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Observaciones: quién hace la observación */}
          <div>
            <label className={styles.label}>Observación realizada por</label>
            <select
              value={formData.observer}
              onChange={(e) =>
                setFormData({ ...formData, observer: e.target.value })
              }
              disabled={formData.assignees.length === 0}
              className={`${styles.field} ${styles.select}`}
            >
              <option value="">
                {formData.assignees.length === 0
                  ? "Agrega primero un asignado"
                  : "Seleccionar quién observa"}
              </option>
              {formData.assignees.map((a, i) => (
                <option key={`${a.name}-${i}`} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className={styles.label}>Descripción *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe la incidencia con el mayor detalle posible..."
              rows={5}
              className={`${styles.field} ${styles.textarea}`}
            />
          </div>

          {/* Imágenes */}
          <div>
            <label className={styles.label}>Imágenes (opcional)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setFormData({
                    ...formData,
                    images: Array.from(files),
                  });
                }
              }}
              className={styles.field}
            />
            <p className={styles.fileHint}>
              {formData.images?.length
                ? `${formData.images.length} imagen(es) seleccionada(s)`
                : "Puedes subir múltiples imágenes"}
            </p>
          </div>

          {/* Botones */}
          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              Crear Incidencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
