"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { useMemo } from "react";
import { Incident } from "@/features/incidents/types/incidents";

interface Props {
  incidents: Incident[];
  selectedDate?: Date;
  onSelectDate?: (date: Date | undefined) => void;
}

export default function ActivityCalendar({
  incidents,
  selectedDate,
  onSelectDate,
}: Props) {
  const incidentsByDay = useMemo(() => {
    const result: Record<string, number> = {};

    incidents.forEach((incident) => {
      const date = incident.createdAt.split("T")[0];

      result[date] = (result[date] || 0) + 1;
    });

    return result;
  }, [incidents]);

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-lg font-semibold">Calendario de actividad</h3>

      <p className="mb-4 text-sm text-gray-500">Incidencias creadas por día</p>

      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        showOutsideDays
        components={{
          DayContent: ({ date }) => {
            const key = date.toISOString().split("T")[0];

            const count = incidentsByDay[key] || 0;

            return (
              <div className="relative flex h-10 w-10 items-center justify-center">
                <span>{date.getDate()}</span>

                {count > 0 && (
                  <div
                    className={`
                      absolute bottom-0 right-0
                      flex h-5 w-5 items-center justify-center
                      rounded-full text-xs text-white
                      ${
                        count >= 3
                          ? "bg-red-500"
                          : count >= 2
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                      }
                    `}
                  >
                    {count}
                  </div>
                )}
              </div>
            );
          },
        }}
      />
    </div>
  );
}
