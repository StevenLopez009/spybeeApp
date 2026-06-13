"use client";

import { useState } from "react";

interface CategoryManagerProps {
  categories: string[];
  onAdd: (name: string) => void;
  onUpdate: (oldName: string, newName: string) => void;
  onRemove: (name: string) => void;
}

export default function CategoryManager({
  categories,
  onAdd,
  onUpdate,
  onRemove,
}: CategoryManagerProps) {
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName);
    setNewName("");
  };

  const startEdit = (name: string) => {
    setEditing(name);
    setEditValue(name);
  };

  const commitEdit = () => {
    if (editing && editValue.trim()) {
      onUpdate(editing, editValue);
    }
    setEditing(null);
    setEditValue("");
  };

  return (
    <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <ul className="space-y-1">
        {categories.map((cat) => (
          <li
            key={cat}
            className="flex items-center gap-2 rounded bg-white px-2 py-1 border border-gray-200"
          >
            {editing === cat ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitEdit();
                  }
                  if (e.key === "Escape") setEditing(null);
                }}
                className="flex-1 px-2 py-1 text-sm border border-amber-300 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none text-black"
              />
            ) : (
              <span className="flex-1 text-sm text-gray-700">{cat}</span>
            )}

            {editing === cat ? (
              <button
                type="button"
                onClick={commitEdit}
                className="text-xs font-medium text-green-600 hover:text-green-800"
              >
                Guardar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startEdit(cat)}
                className="text-xs font-medium text-amber-600 hover:text-amber-700"
              >
                Editar
              </button>
            )}
            <button
              type="button"
              onClick={() => onRemove(cat)}
              className="text-xs font-medium text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="text-xs text-gray-400 px-2 py-1">
            No hay categorías. Agrega una abajo.
          </li>
        )}
      </ul>

      <div className="mt-2 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Nueva categoría"
          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-amber-400 focus:outline-none text-black"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 text-sm font-medium bg-amber-400 text-white rounded hover:bg-amber-500"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
