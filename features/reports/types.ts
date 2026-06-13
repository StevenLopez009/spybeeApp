export interface ReportsMetric {
  id: string;
  sequenceId: string;
  order: number;
  title: string;
  description: string;

  priority: "low" | "medium" | "high";

  status: "open" | "closed";

  coordinates: {
    lat: number;
    lng: number;
  };

  locationDescription: string;

  createdAt: string;
  updatedAt: string;

  dueDate: string | null;
  closingDate: string | null;
}
