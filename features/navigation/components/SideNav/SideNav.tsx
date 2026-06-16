"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SideNav.module.scss";

type Item = { key: string; label: string; href: string };

const items: Item[] = [
  { key: "home", label: "Inicio", href: "/" },
  { key: "pie", label: "Reportes", href: "/reports" },
];

const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const paths: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </>
  ),
  pie: (
    <>
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </>
  ),
};

function Icon({ name }: { name: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

interface SideNavProps {
  expanded: boolean;
  onToggle: () => void;
}

export default function SideNav({ expanded, onToggle }: SideNavProps) {
  const pathname = usePathname();

  const isActive = (it: Item) =>
    it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);

  return (
    <>
      {/* Bottom nav — móvil */}
      <nav className={styles.bottomNav}>
        {items.map((it) => {
          const active = isActive(it);
          return (
            <Link
              key={it.key}
              href={it.href}
              aria-label={it.label}
              className={`${styles.bottomItem} ${
                active ? styles.bottomItemActive : ""
              }`}
            >
              <Icon name={it.key} />
              <span className={styles.bottomLabel}>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Rail izquierdo — tablet / desktop */}
      <nav
        className={`${styles.rail} ${
          expanded ? styles.railExpanded : styles.railCollapsed
        }`}
      >
        {/* Avatar + botón expandir */}
        <div className={styles.header}>
          <div className={styles.avatar} style={{ clipPath: HEX }}>
            🐺
          </div>
          {expanded && <span className={styles.accountName}>Mi cuenta</span>}
          <button
            type="button"
            onClick={onToggle}
            aria-label={expanded ? "Contraer" : "Expandir"}
            className={styles.expandButton}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${styles.expandIcon} ${
                expanded ? styles.expandIconRotated : ""
              }`}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className={styles.divider} />

        {/* Iconos de navegación */}
        <div className={styles.navList}>
          {items.map((it) => {
            const active = isActive(it);
            const className = `${styles.item} ${
              expanded ? styles.itemExpanded : styles.itemCollapsed
            } ${active ? styles.itemActive : styles.itemInactive}`;

            return (
              <Link
                key={it.key}
                href={it.href}
                title={it.label}
                aria-label={it.label}
                className={className}
              >
                <Icon name={it.key} />
                {expanded && (
                  <span className={styles.itemLabel}>{it.label}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
