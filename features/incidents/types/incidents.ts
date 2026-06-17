export interface Incident {
  id: string;
  sequenceId: string;
  title: string;
  description?: string;

  createdAt: string;
  updatedAt?: string;
  closedAt?: string;
  dueDate?: string | null;

  status: "open" | "closed" | "on_pause";
  priority: "high" | "medium" | "low";

  owner?: {
    id: string;
    name: string;
    avatarUrl?: string;
  } | null;

  assignees: {
    id?: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }[];

  coordinates?: {
    lat: number;
    lng: number;
  };

  type?: {
    id: string;
    key: string;
    name: string;
    name_en?: string;
  };
}
