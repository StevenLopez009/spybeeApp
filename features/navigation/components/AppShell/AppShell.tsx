"use client";

import { useState } from "react";
import styles from "./AppShell.module.scss";
import SideNav from "../SideNav/SideNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <SideNav expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      <div
        className={`${styles.content} ${
          expanded ? styles.contentExpanded : styles.contentCollapsed
        }`}
      >
        {children}
      </div>
    </>
  );
}
