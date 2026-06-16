import { create } from "zustand";
import { Dayjs } from "dayjs";
import { Incident } from "@/features/incidents/types/incidents";

interface ReportsFilters {
  period: string;
  createdBy: string | null;
  assignedTo: string | null;
}

interface ReportsState {
  incidents: Incident[];
  dateRange: [Dayjs | null, Dayjs | null] | null;
  selectedDate?: Date;
  filters: ReportsFilters;

  setIncidents: (incidents: Incident[]) => void;
  setDateRange: (range: [Dayjs | null, Dayjs | null] | null) => void;
  setSelectedDate: (date?: Date) => void;
  setFilters: (filters: Partial<ReportsFilters>) => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  incidents: [],
  dateRange: null,
  selectedDate: undefined,

  filters: {
    period: "all",
    createdBy: null,
    assignedTo: null,
  },

  setIncidents: (incidents) =>
    set({
      incidents,
    }),

  setDateRange: (dateRange) =>
    set({
      dateRange,
    }),

  setSelectedDate: (selectedDate) =>
    set({
      selectedDate,
    }),

  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),
}));
