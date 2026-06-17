"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./IncidentHeatMap.module.scss";
import type { Feature, FeatureCollection, Point } from "geojson";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface IncidentLocation {
  id: string;
  title: string;
  priority: string;
  status: string;

  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Props {
  incidents: IncidentLocation[];
}

export default function IncidentHeatMap({ incidents }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const geojson = useMemo<FeatureCollection<Point>>(
    () => ({
      type: "FeatureCollection",
      features: incidents
        .filter(
          (incident) =>
            typeof incident.coordinates.lat === "number" &&
            typeof incident.coordinates.lng === "number",
        )
        .map((incident) => ({
          type: "Feature" as const,
          properties: {
            id: incident.id,
            title: incident.title,
            priority: incident.priority,
            status: incident.status,
          },
          geometry: {
            type: "Point" as const,
            coordinates: [incident.coordinates.lng, incident.coordinates.lat],
          },
        })),
    }),
    [incidents],
  );

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.2301, 4.7058],
      zoom: 14,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("incidents", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        } as FeatureCollection<Point>,
      });

      map.addLayer({
        id: "heatmap",
        type: "heatmap",
        source: "incidents",
        maxzoom: 18,
        paint: {
          "heatmap-weight": 1,
          "heatmap-intensity": 2,
          "heatmap-radius": 40,
          "heatmap-opacity": 0.8,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,255,0)",
            0.2,
            "royalblue",
            0.4,
            "cyan",
            0.6,
            "lime",
            0.8,
            "yellow",
            1,
            "red",
          ],
        },
      });

      map.addLayer({
        id: "incident-points",
        type: "circle",
        source: "incidents",
        paint: {
          "circle-radius": 6,
          "circle-color": "#FFD700",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#FFFFFF",
        },
      });
      const source = map.getSource("incidents") as mapboxgl.GeoJSONSource;
      source.setData(geojson);

      setTimeout(() => {
        map.resize();
      }, 100);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Actualizar datos cuando cambien las incidencias
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const updateData = () => {
      const source = map.getSource("incidents");
      if (!source) return;
      (source as mapboxgl.GeoJSONSource).setData(geojson);
    };

    if (map.isStyleLoaded()) {
      updateData();
    } else {
      map.once("load", updateData);
    }
  }, [geojson]);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Mapa de calor de incidencias</h3>

      <div ref={mapContainer} className={styles.mapContainer} />
    </div>
  );
}
