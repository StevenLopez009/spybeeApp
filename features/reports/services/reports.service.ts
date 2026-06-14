import { Incident } from "@/features/incidents/types/incidents";

const INCIDENTS_URL = process.env.NEXT_PUBLIC_INCIDENTS_URL!;

export async function getIncidents(): Promise<Incident[]> {
  const response = await fetch(INCIDENTS_URL, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Error loading incidents");
  }

  return response.json();
}
