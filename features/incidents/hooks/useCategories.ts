"use client";

import { useEffect, useState } from "react";
import { CATEGORIES } from "../types";

const STORAGE_KEY = "spybee:categories";

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([...CATEGORIES]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed) && parsed.every((c) => typeof c === "string")) {
        setCategories(parsed);
      }
    } catch {
      // almacenamiento corrupto o no disponible: usamos la semilla
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch {
      // ignorar fallos de escritura (modo privado, cuota, etc.)
    }
  }, [categories, loaded]);

  const exists = (name: string) =>
    categories.some((c) => c.toLowerCase() === name.trim().toLowerCase());

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || exists(trimmed)) return;
    setCategories((prev) => [...prev, trimmed]);
  };

  const updateCategory = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setCategories((prev) => prev.map((c) => (c === oldName ? trimmed : c)));
  };

  const removeCategory = (name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  };

  return { categories, addCategory, updateCategory, removeCategory };
}
