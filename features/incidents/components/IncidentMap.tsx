"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IncidentData } from "../types";
import MapChrome from "./MapChrome/MapChrome";
import IncidentForm from "./IncidentForm/IncidentForm";

import styles from "./IncidentMap.module.scss";
import IncidentSidebar from "./InsidentSideBar/IncidentSideBar";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface SelectedLocation {
  coordinates: {
    lng: number;
    lat: number;
  };
  address?: string;
}

export default function IncidentMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const incidentMarkersRef = useRef<mapboxgl.Marker[]>([]);

  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(
    null,
  );
  // Última incidencia creada o consultada, para poder reabrir su detalle
  const [lastIncident, setLastIncident] = useState<IncidentData | null>(null);
  const [is3D, setIs3D] = useState(false);
  const [is360, setIs360] = useState(false);
  const orbitRef = useRef<number | null>(null);
  const is360Ref = useRef(false);

  const openIncident = (data: IncidentData) => {
    setLastIncident(data);
    setSelectedIncident(data);
  };

  const ensureBuildings = (map: mapboxgl.Map) => {
    if (map.getLayer("3d-buildings")) return;
    const layer = {
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "min_height"],
        "fill-extrusion-opacity": 0.6,
      },
    };
    try {
      map.addLayer(layer as Parameters<mapboxgl.Map["addLayer"]>[0]);
    } catch {}
  };

  const stopOrbit = () => {
    if (orbitRef.current !== null) {
      cancelAnimationFrame(orbitRef.current);
      orbitRef.current = null;
    }
  };

  // Giro continuo de la cámara alrededor del punto (vista 360°)
  const startOrbit = () => {
    stopOrbit();
    const step = () => {
      const map = mapRef.current;
      if (!map || !is360Ref.current) return;
      map.setBearing(map.getBearing() + 0.35);
      orbitRef.current = requestAnimationFrame(step);
    };
    orbitRef.current = requestAnimationFrame(step);
  };

  const set3D = (enable: boolean) => {
    const map = mapRef.current;
    if (!map) return;
    setIs3D(enable);

    if (enable) {
      ensureBuildings(map);
      map.easeTo({
        pitch: 60,
        zoom: Math.max(map.getZoom(), 15),
        duration: 800,
      });
    } else {
      is360Ref.current = false;
      setIs360(false);
      stopOrbit();
      if (map.getLayer("3d-buildings")) map.removeLayer("3d-buildings");
      map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    }
  };

  const set360 = (enable: boolean) => {
    const map = mapRef.current;
    if (!map) return;

    if (enable) {
      if (!lastIncident) return;
      // 360° implica 3D
      setIs3D(true);
      ensureBuildings(map);
      is360Ref.current = true;
      setIs360(true);
      map.flyTo({
        center: [lastIncident.coordinates.lng, lastIncident.coordinates.lat],
        zoom: 17,
        pitch: 65,
        duration: 1200,
      });
      map.once("moveend", () => {
        if (is360Ref.current) startOrbit();
      });
    } else {
      is360Ref.current = false;
      setIs360(false);
      stopOrbit();
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.0721, 4.711],
      zoom: 12,
    });

    mapRef.current = map;
    map.on("load", () => map.resize());

    const resizeObserver = new ResizeObserver(() => mapRef.current?.resize());
    resizeObserver.observe(mapContainer.current);

    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const marker = new mapboxgl.Marker({
        color: "#F5B301",
        draggable: false,
      })
        .setLngLat([lng, lat])
        .addTo(map);

      markerRef.current = marker;

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`,
        );
        const data = await response.json();
        const address =
          data.features[0]?.place_name || "Dirección no disponible";

        setSelectedLocation({
          coordinates: { lng, lat },
          address,
        });
      } catch (error) {
        console.error("Error al obtener la dirección:", error);
        setSelectedLocation({
          coordinates: { lng, lat },
          address: "Error al cargar la dirección",
        });
      }
    });

    return () => {
      stopOrbit();
      resizeObserver.disconnect();
      if (markerRef.current) {
        markerRef.current.remove();
      }
      incidentMarkersRef.current.forEach((m) => m.remove());
      incidentMarkersRef.current = [];
      map.remove();
    };
  }, []);

  const handleFormSubmit = async (data: IncidentData) => {
    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        if (mapRef.current) {
          const el = document.createElement("div");
          el.textContent = "🚨";
          el.style.fontSize = "26px";
          el.style.lineHeight = "1";
          el.style.cursor = "pointer";
          el.title = data.title;
          el.addEventListener("click", (ev) => {
            ev.stopPropagation();
            openIncident(data);
          });

          const incidentMarker = new mapboxgl.Marker({ element: el })
            .setLngLat([data.coordinates.lng, data.coordinates.lat])
            .addTo(mapRef.current);

          incidentMarkersRef.current.push(incidentMarker);
        }
        openIncident(data);
      } else {
        alert("❌ Error al crear la incidencia. Por favor intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al enviar incidencia:", error);
      alert("❌ Error al crear la incidencia. Por favor intenta de nuevo.");
    }

    setShowForm(false);
    setSelectedLocation(null);

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedLocation(null);

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  };

  return (
    <>
      <div className={styles.mapWrapper}>
        <div ref={mapContainer} className={styles.mapCanvas} />

        <MapChrome
          is3D={is3D}
          onSet3D={set3D}
          is360={is360}
          onSet360={set360}
          canOrbit={!!lastIncident}
          onShowDetails={() =>
            lastIncident && setSelectedIncident(lastIncident)
          }
          canShowDetails={!!lastIncident}
          canCreate={!!selectedLocation}
          onCreateIncident={() => {
            if (!selectedLocation) return;
            setShowForm(true);
          }}
        />
      </div>

      {showForm && selectedLocation && (
        <IncidentForm
          coordinates={selectedLocation.coordinates}
          address={selectedLocation.address}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {selectedIncident && (
        <IncidentSidebar
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </>
  );
}
