"use client";

import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Incident } from "@/features/incidents/types/incidents";

interface Props {
  incidents: Incident[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

export default function ActivityCalendar({
  incidents,
  selectedDate,
  onSelectDate,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const incidentsByDay = useMemo(() => {
    const result: Record<string, number> = {};

    incidents.forEach((incident) => {
      const key = dayjs(incident.createdAt).format("YYYY-MM-DD");

      result[key] = (result[key] || 0) + 1;
    });

    return result;
  }, [incidents]);

  const calendarDays = useMemo(() => {
    const startOfMonth = currentMonth.startOf("month");
    const startDate = startOfMonth.startOf("week");

    return Array.from({ length: 42 }, (_, index) =>
      startDate.add(index, "day"),
    );
  }, [currentMonth]);

  const weekDays = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

  const getBadgeColor = (count: number) => {
    if (count >= 5) return "bg-orange-400";
    if (count >= 3) return "bg-yellow-400";

    return "bg-yellow-200";
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-bold text-slate-800">
        Calendario de actividad
      </h3>

      <p className="mt-1 text-sm text-slate-500">Incidencias creadas por día</p>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}
          className="flex h-12 w-12 items-center justify-center rounded-xl border bg-white hover:bg-slate-50"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-3">
          <div className="flex h-12 min-w-[110px] items-center justify-center rounded-xl border px-4 font-semibold">
            {currentMonth.format("YYYY")}
          </div>

          <div className="flex h-12 min-w-[110px] items-center justify-center rounded-xl border px-4 font-semibold capitalize">
            {currentMonth.format("MMM")}
          </div>
        </div>

        <button
          onClick={() => setCurrentMonth((prev) => prev.add(1, "month"))}
          className="flex h-12 w-12 items-center justify-center rounded-xl border bg-white hover:bg-slate-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-8 grid grid-cols-7 gap-2 text-center text-sm font-semibold text-slate-500">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {calendarDays.map((date) => {
          const key = date.format("YYYY-MM-DD");

          const count = incidentsByDay[key] || 0;

          const isCurrentMonth = date.month() === currentMonth.month();

          const isSelected =
            selectedDate && dayjs(selectedDate).isSame(date, "day");

          return (
            <button
              key={key}
              onClick={() => onSelectDate?.(date.toDate())}
              className={`
                relative h-16 rounded-xl transition-all
                ${
                  isSelected
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 hover:bg-slate-200"
                }
                ${!isCurrentMonth ? "opacity-30" : ""}
              `}
            >
              <div className="flex h-full flex-col items-center justify-center">
                <span className="text-sm font-medium">{date.date()}</span>

                {count > 0 && (
                  <div
                    className={`
                      mt-1 flex h-6 w-6 items-center justify-center
                      rounded-full text-xs font-bold text-slate-800
                      ${getBadgeColor(count)}
                    `}
                  >
                    {count}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
