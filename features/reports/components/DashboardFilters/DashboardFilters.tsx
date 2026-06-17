"use client";

import { useMemo, useState } from "react";
import { Button, Drawer, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useReportsStore } from "../../store/reports.store";
import styles from "./DashboardFilters.module.scss";

export default function DashboardFilters() {
  const [open, setOpen] = useState(false);

  const incidents = useReportsStore((state) => state.incidents);
  const filters = useReportsStore((state) => state.filters);
  const setFilters = useReportsStore((state) => state.setFilters);

  const creators = useMemo(() => {
    return [
      ...new Map(
        incidents
          .filter((incident) => incident.owner)
          .map((incident) => [incident.owner!.id, incident.owner]),
      ).values(),
    ];
  }, [incidents]);

  const assignees = useMemo(() => {
    return [
      ...new Map(
        incidents.flatMap((incident) =>
          incident.assignees.map((assignee) => [assignee.id, assignee]),
        ),
      ).values(),
    ];
  }, [incidents]);

  const clearFilters = () => {
    setFilters({
      period: "all",
      createdBy: null,
      assignedTo: null,
    });
  };

  return (
    <>
      <Button
        icon={<FilterOutlined />}
        onClick={() => setOpen(true)}
        className={styles.filterButton}
      >
        Filtros
      </Button>

      <Drawer
        title="Filtros"
        open={open}
        size="default"
        onClose={() => setOpen(false)}
      >
        <div className={styles.filters}>
          <div className={styles.field}>
            <label className={styles.label}>Periodo</label>

            <Select
              className={styles.select}
              value={filters.period}
              onChange={(value) => setFilters({ period: value })}
              options={[
                {
                  value: "all",
                  label: "Todo el tiempo",
                },
                {
                  value: "7d",
                  label: "Últimos 7 días",
                },
                {
                  value: "30d",
                  label: "Últimos 30 días",
                },
                {
                  value: "90d",
                  label: "Últimos 90 días",
                },
              ]}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Creado por usuario</label>
            <Select
              className={styles.select}
              allowClear
              value={filters.createdBy}
              placeholder="Todos"
              onChange={(value) =>
                setFilters({
                  createdBy: value ?? null,
                })
              }
              options={creators
                .filter((user): user is NonNullable<typeof user> =>
                  Boolean(user),
                )
                .map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Responsable</label>

            <Select
              className={styles.select}
              allowClear
              value={filters.assignedTo}
              placeholder="Todos"
              onChange={(value) =>
                setFilters({
                  assignedTo: value ?? null,
                })
              }
              options={assignees.map((user) => ({
                value: user.id,
                label: user.name,
              }))}
            />
          </div>

          <div className={styles.actions}>
            <Button onClick={clearFilters}>Limpiar</Button>

            <Button type="primary" onClick={() => setOpen(false)}>
              Aplicar
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
