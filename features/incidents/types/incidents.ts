export interface Incident {
  id: string;
  createdAt: string;
  closedAt?: string;
  updatedAt?: string;
  status: "open" | "closed" | "on_pause";
  priority: "high" | "medium" | "low";
  dueDate?: string;
  owner?: {
    id: string;
    name: string;
    avatarUrl?: string;
  } | null;
  assignees: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }[];
}
