"use client";

import { useState } from "react";
import SideNav from "./SideNav";

/**
 * Shell de la aplicación: monta la navegación y desplaza el contenido.
 * Mantiene el estado de expandido/contraído del riel izquierdo para que
 * el margen del contenido siga el ancho real del riel (sin solaparse).
 * Por defecto el riel queda abierto en tablet/desktop.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <SideNav expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      <div
        className={`flex min-h-screen flex-col pb-16 transition-all duration-200 sm:pb-0 ${
          expanded ? "sm:ml-56" : "sm:ml-16"
        }`}
      >
        {children}
      </div>
    </>
  );
}
