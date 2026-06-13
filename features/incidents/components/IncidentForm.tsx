"use client";

import { useState } from "react";
import { IncidentData, Assignee, PRIORITIES, DEFAULT_LEVELS } from "../types";

import { useCategories } from "../hooks/useCategories";
import CategoryManager from "./CategoryManager";

interface IncidentFormProps {
  coordinates: {
    lng: number;
    lat: number;
  };
  address?: string;
  onClose: () => void;
  onSubmit: (data: IncidentData) => void;
}

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

  // Niveles disponibles = los por defecto + los personalizados que se vayan agregando
  const [levels, setLevels] = useState<string[]>([...DEFAULT_LEVELS]);
  const [newLevel, setNewLevel] = useState("");

  // Borrador del asignado que se está agregando
  const [assigneeDraft, setAssigneeDraft] = useState<Assignee>({
    name: "",
    role: "",
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
    if (!assigneeDraft.name.trim() || !assigneeDraft.role.trim()) return;
    setFormData((prev) => ({
      ...prev,
      assignees: [
        ...prev.assignees,
        {
          name: assigneeDraft.name.trim(),
          role: assigneeDraft.role.trim(),
        },
      ],
    }));
    setAssigneeDraft({ name: "", role: "" });
  };

  const removeAssignee = (index: number) => {
    setFormData((prev) => {
      const removed = prev.assignees[index];
      return {
        ...prev,
        assignees: prev.assignees.filter((_, i) => i !== index),
        // Si el observador era el asignado eliminado, lo limpiamos
        observer: prev.observer === removed?.name ? "" : prev.observer,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 py-4 sm:px-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Nueva Incidencia</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-5 sm:space-y-6"
        >
          {/* Ubicación */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">📍 Ubicación</h3>
            <p className="text-sm text-gray-600">
              {address || "Cargando dirección..."}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded bg-white px-3 py-2 border border-amber-100">
                <span className="block text-xs text-gray-400">Latitud</span>
                <span className="text-sm font-mono text-gray-700">
                  {coordinates.lat.toFixed(6)}
                </span>
              </div>
              <div className="rounded bg-white px-3 py-2 border border-amber-100">
                <span className="block text-xs text-gray-400">Longitud</span>
                <span className="text-sm font-mono text-gray-700">
                  {coordinates.lng.toFixed(6)}
                </span>
              </div>
            </div>

            {/* Detalles de la localización */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detalles de la localización
              </label>
              <textarea
                value={formData.locationDetails}
                onChange={(e) =>
                  setFormData({ ...formData, locationDetails: e.target.value })
                }
                placeholder="Ej: junto a la recepción, pasillo norte, frente al ascensor..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-black resize-none"
              />
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la incidencia *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ej: Bache en la calzada"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-black"
            />
          </div>

          {/* Categoría + gestión */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Categoría *
              </label>
              <button
                type="button"
                onClick={() => setManagingCategories((v) => !v)}
                className="text-xs font-medium text-amber-600 hover:text-amber-700"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-black"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    formData.priority === priority
                      ? priority === "Urgente"
                        ? "bg-red-500 text-white"
                        : priority === "Alta"
                          ? "bg-orange-500 text-white"
                          : priority === "Media"
                            ? "bg-yellow-500 text-white"
                            : "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Fecha de vencimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-black"
            />
          </div>

          {/* Etiquetas: pisos / niveles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Piso / Nivel (etiquetas)
            </label>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => {
                const selected = formData.tags.includes(level);
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => toggleTag(level)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                      selected
                        ? "bg-amber-400 text-white border-amber-400"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex gap-2">
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
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none text-black"
              />
              <button
                type="button"
                onClick={addLevel}
                className="px-3 py-1.5 text-sm font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Añadir
              </button>
            </div>
          </div>

          {/* Asignados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asignados
            </label>

            {formData.assignees.length > 0 && (
              <ul className="mb-2 space-y-1">
                {formData.assignees.map((a, i) => (
                  <li
                    key={`${a.name}-${i}`}
                    className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 border border-gray-200"
                  >
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">{a.name}</span>
                      <span className="text-gray-500"> — {a.role}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAssignee(i)}
                      className="text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={assigneeDraft.name}
                onChange={(e) =>
                  setAssigneeDraft({ ...assigneeDraft, name: e.target.value })
                }
                placeholder="Nombre"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none text-black"
              />
              <input
                value={assigneeDraft.role}
                onChange={(e) =>
                  setAssigneeDraft({ ...assigneeDraft, role: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAssignee();
                  }
                }}
                placeholder="Cargo"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none text-black"
              />
              <button
                type="button"
                onClick={addAssignee}
                className="px-4 py-2 text-sm font-medium bg-amber-400 text-white rounded hover:bg-amber-500"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Observaciones: quién hace la observación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observación realizada por
            </label>
            <select
              value={formData.observer}
              onChange={(e) =>
                setFormData({ ...formData, observer: e.target.value })
              }
              disabled={formData.assignees.length === 0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-black disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {formData.assignees.length === 0
                  ? "Agrega primero un asignado"
                  : "Seleccionar quién observa"}
              </option>
              {formData.assignees.map((a, i) => (
                <option key={`${a.name}-${i}`} value={a.name}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe la incidencia con el mayor detalle posible..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-black resize-none"
            />
          </div>

          {/* Imágenes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imágenes (opcional)
            </label>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.images?.length
                ? `${formData.images.length} imagen(es) seleccionada(s)`
                : "Puedes subir múltiples imágenes"}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-amber-400 text-white rounded-lg font-medium hover:bg-amber-500 transition"
            >
              Crear Incidencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
