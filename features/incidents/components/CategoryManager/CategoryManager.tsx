"use client";

import { useState } from "react";
import styles from "./CategoryManager.module.scss";

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
    <div className={styles.manager}>
      <ul className={styles.list}>
        {categories.map((cat) => (
          <li key={cat} className={styles.item}>
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
                className={styles.editInput}
              />
            ) : (
              <span className={styles.name}>{cat}</span>
            )}

            {editing === cat ? (
              <button
                type="button"
                onClick={commitEdit}
                className={styles.saveBtn}
              >
                Guardar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startEdit(cat)}
                className={styles.editBtn}
              >
                Editar
              </button>
            )}
            <button
              type="button"
              onClick={() => onRemove(cat)}
              className={styles.removeBtn}
            >
              Eliminar
            </button>
          </li>
        ))}
        {categories.length === 0 && (
          <li className={styles.empty}>No hay categorías. Agrega una abajo.</li>
        )}
      </ul>

      <div className={styles.addRow}>
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
          className={styles.addInput}
        />
        <button type="button" onClick={handleAdd} className={styles.addBtn}>
          Agregar
        </button>
      </div>
    </div>
  );
}
