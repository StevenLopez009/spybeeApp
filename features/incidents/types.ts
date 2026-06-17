// Tipos para el sistema de incidencias

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface Assignee {
  id?: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export interface IncidentData {
  title: string;
  description: string;
  category: string;
  priority: "Baja" | "Media" | "Alta" | "Urgente";
  dueDate?: string;
  tags: string[];
  assignees: Assignee[];
  observer?: string;
  coordinates: Coordinates;
  address?: string;
  locationDetails?: string;
  images?: File[];
}

export interface Incident extends Omit<IncidentData, "images"> {
  id: number | string;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  createdAt: string;
  updatedAt?: string;
  imageUrls?: string[];
}

export const CATEGORIES = [
  "Infraestructura",
  "Servicios Públicos",
  "Seguridad",
  "Medio Ambiente",
  "Transporte",
  "Otro",
] as const;

export const PRIORITIES = ["Baja", "Media", "Alta", "Urgente"] as const;

// Etiquetas por defecto para pisos / niveles
export const DEFAULT_LEVELS = [
  "Sótano",
  "Planta baja",
  "Piso 1",
  "Piso 2",
  "Piso 3",
  "Piso 4",
  "Azotea",
] as const;

export const STATUSES = [
  "pending",
  "in_progress",
  "resolved",
  "rejected",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Status = (typeof STATUSES)[number];
