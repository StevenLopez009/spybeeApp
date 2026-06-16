"use client";

import { ReactNode, useEffect, useState } from "react";
import styles from "./MapChrome.module.scss";

interface MapChromeProps {
  is3D: boolean;
  onSet3D: (enable: boolean) => void;
  is360: boolean;
  onSet360: (enable: boolean) => void;
  canOrbit: boolean;
  onShowDetails: () => void;
  canShowDetails: boolean;
  onCreateIncident: () => void;
  /** Solo se puede crear cuando hay una ubicación marcada en el mapa. */
  canCreate: boolean;
}

function Svg({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const I = {
  panel: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M15 3v18" />
    </>
  ),
  filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  folderStar: (
    <>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
      <path d="m12 10 1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 12.3l2-.3z" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </>
  ),
  image: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </>
  ),
  brush: (
    <>
      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
    </>
  ),
  share: (
    <>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  film: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18M17 3v18M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4" />
    </>
  ),
  locate: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  map: (
    <>
      <path d="M14.1 4.6 9 2 3.6 4.7A1 1 0 0 0 3 5.6v14.3a.5.5 0 0 0 .7.5L9 18l6 3 5.4-2.7a1 1 0 0 0 .6-.9V3.8a.5.5 0 0 0-.7-.5L15 6" />
      <path d="M9 2v16M15 6v16" />
    </>
  ),
  bookmarkMap: (
    <>
      <path d="M9 10a3 3 0 1 0 6 0c0-2-3-6-3-6s-3 4-3 6Z" />
      <path d="M5 21h14" />
    </>
  ),
  triangle: <path d="M12 3 2 21h20L12 3Z" />,
};

function CreateButton({
  canCreate,
  onCreate,
  reason,
}: {
  canCreate: boolean;
  onCreate: () => void;
  reason: string;
}) {
  const [showTip, setShowTip] = useState(false);

  // Autoocultar el tooltip
  useEffect(() => {
    if (!showTip) return;
    const id = window.setTimeout(() => setShowTip(false), 2500);
    return () => window.clearTimeout(id);
  }, [showTip]);

  return (
    <span
      className={styles.createWrap}
      onMouseEnter={() => !canCreate && setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <button
        type="button"
        aria-disabled={!canCreate}
        aria-label="Crear incidencia"
        title={canCreate ? "Crear incidencia" : undefined}
        onClick={() => (canCreate ? onCreate() : setShowTip(true))}
        className={`${styles.createBtn} ${
          canCreate ? styles.createBtnEnabled : styles.createBtnDisabled
        }`}
      >
        <Svg>{I.plus}</Svg>
      </button>

      {!canCreate && showTip && (
        <span role="tooltip" className={styles.tooltip}>
          {reason}
        </span>
      )}
    </span>
  );
}

export default function MapChrome({
  is3D,
  onSet3D,
  is360,
  onSet360,
  canOrbit,
  onShowDetails,
  canShowDetails,
  onCreateIncident,
  canCreate,
}: MapChromeProps) {
  const createReason = "Marca primero una ubicación en el mapa";

  return (
    <>
      {/* Top-left: Ver detalles */}
      <button
        type="button"
        onClick={onShowDetails}
        disabled={!canShowDetails}
        title={
          canShowDetails
            ? "Ver información de la incidencia"
            : "Crea o selecciona una incidencia primero"
        }
        className={styles.detailsBtn}
      >
        Ver detalles
        <Svg size={18}>{I.panel}</Svg>
      </button>

      {/* Top-center: filtro + fecha + visitas */}
      <div className={styles.topBar}>
        <button type="button" className={styles.iconBtn} title="Filtros">
          <Svg>{I.filter}</Svg>
        </button>
        <div className={styles.dateBox}>
          02 jun 2026
          <Svg size={16}>{I.chevronDown}</Svg>
        </div>
        <span className={styles.topLabel}>Últimas 5 visitas</span>
        <div className={styles.dots}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={i === 4 ? styles.dotActive : styles.dot} />
          ))}
        </div>
        <button type="button" className={styles.iconBtn} title="Añadir">
          <Svg size={18}>{I.plus}</Svg>
        </button>
      </div>

      {/* Right: botón Crear (desktop) */}
      <div className={styles.toolbar}>
        <CreateButton
          canCreate={canCreate}
          onCreate={onCreateIncident}
          reason={createReason}
        />
      </div>

      {/* Bottom-center: 2D/3D + 360° */}
      <div className={styles.viewBar}>
        <button
          type="button"
          onClick={() => onSet3D(false)}
          className={`${styles.viewBtn} ${
            !is3D ? styles.viewBtnActive : styles.viewBtnInactive
          }`}
        >
          2D
        </button>
        <button
          type="button"
          onClick={() => onSet3D(true)}
          className={`${styles.viewBtn} ${
            is3D ? styles.viewBtnActive : styles.viewBtnInactive
          }`}
        >
          3D
        </button>
        <div className={styles.viewSep} />

        <button
          type="button"
          onClick={() => onSet360(!is360)}
          disabled={!canOrbit}
          title={
            canOrbit
              ? "Vista 360° de la incidencia"
              : "Crea o selecciona una incidencia primero"
          }
          className={styles.toggle360}
        >
          <span
            className={is360 ? styles.toggleLabelActive : styles.toggleLabel}
          >
            360°
          </span>
          <span
            className={`${styles.switch} ${is360 ? styles.switchActive : ""}`}
          >
            <span
              className={`${styles.knob} ${is360 ? styles.knobActive : ""}`}
            />
          </span>
        </button>
      </div>

      {/* Bottom-right: logo */}
      <div className={styles.logo}>Spybee</div>

      <div className={styles.mobileCreate}>
        <CreateButton
          canCreate={canCreate}
          onCreate={onCreateIncident}
          reason={createReason}
        />
      </div>
    </>
  );
}
