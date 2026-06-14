export interface Incident {
  id: string;
  createdAt: string;
  closedAt?: string;
  updatedAt?: string;
  status: "open" | "closed" | "on_pause";
  priority: "high" | "medium" | "low";
  dueDate?: string;
}
