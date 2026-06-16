"use client";

import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Incident } from "@/features/incidents/types/incidents";

import styles from "./ActivityCalendar.module.scss";

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

    return Array.from({ length: 42 }, (_, i) => startDate.add(i, "day"));
  }, [currentMonth]);

  const weekDays = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

  const getBadgeType = (count: number) => {
    if (count >= 5) return "high";
    if (count >= 3) return "medium";
    return "low";
  };

  return (
    <div className={styles.calendar}>
      <h3 className={styles.calendar__title}>Calendario de actividad</h3>

      <p className={styles.calendar__subtitle}>Incidencias creadas por día</p>

      <div className={styles.calendar__header}>
        <button
          onClick={() => setCurrentMonth((prev) => prev.subtract(1, "month"))}
          className={styles.calendar__navButton}
        >
          <ChevronLeft size={18} />
        </button>

        <div className={styles.calendar__monthBox}>
          <div>{currentMonth.format("YYYY")}</div>
          <div>{currentMonth.format("MMM")}</div>
        </div>

        <button
          onClick={() => setCurrentMonth((prev) => prev.add(1, "month"))}
          className={styles.calendar__navButton}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.calendar__weekdays}>
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className={styles.calendar__grid}>
        {calendarDays.map((date) => {
          const isCurrentMonth = date.month() === currentMonth.month();

          if (!isCurrentMonth) return null;

          const key = date.format("YYYY-MM-DD");
          const count = incidentsByDay[key] || 0;

          const isSelected =
            selectedDate && dayjs(selectedDate).isSame(date, "day");

          return (
            <button
              key={key}
              onClick={() => onSelectDate?.(date.toDate())}
              className={`
        ${styles.calendar__day}
        ${isSelected ? styles["calendar__day--selected"] : ""}
      `}
            >
              <div className={styles.calendar__dayContent}>
                <span className={styles.calendar__dayNumber}>
                  {date.date()}
                </span>

                {count > 0 && (
                  <div
                    className={`
              ${styles.calendar__badge}
              ${styles[`calendar__badge--${getBadgeType(count)}`]}
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
