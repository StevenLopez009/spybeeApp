import { create } from "zustand";
import { Dayjs } from "dayjs";
import { Incident } from "@/features/incidents/types/incidents";

interface ReportsState {
  incidents: Incident[];

  dateRange: [Dayjs | null, Dayjs | null] | null;
  selectedDate?: Date;

  setIncidents: (incidents: Incident[]) => void;
  setDateRange: (range: [Dayjs | null, Dayjs | null] | null) => void;
  setSelectedDate: (date?: Date) => void;
}

export const useReportsStore = create<ReportsState>((set) => ({
  incidents: [],

  dateRange: null,

  selectedDate: undefined,

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
}));
