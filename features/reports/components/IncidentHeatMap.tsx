"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { useMemo } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface IncidentLocation {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  priority: string;
  status: string;
}

interface Props {
  incidents: IncidentLocation[];
}

export default function IncidentHeatMap({ incidents }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: incidents.map((incident) => ({
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
    if (!mapContainer.current) return;

    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",

      center: [-74.2301, 4.7058],
      zoom: 15,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const loadHeatmap = () => {
      const sourceId = "incidents";

      if (map.getLayer("heatmap")) {
        map.removeLayer("heatmap");
      }

      if (map.getLayer("incident-points")) {
        map.removeLayer("incident-points");
      }

      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      map.addSource(sourceId, {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "heatmap",
        type: "heatmap",
        source: sourceId,

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
        source: sourceId,

        paint: {
          "circle-radius": 6,
          "circle-color": "#FFD700",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#FFFFFF",
        },
      });
    };

    if (map.isStyleLoaded()) {
      loadHeatmap();
    } else {
      map.once("load", loadHeatmap);
    }
  }, [geojson]);

  return <div ref={mapContainer} className="w-full h-[600px] rounded-xl" />;
}
