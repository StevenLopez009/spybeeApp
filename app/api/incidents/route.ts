import { NextRequest, NextResponse } from "next/server";
import { IncidentData, Incident } from "@/features/incidents/types";

export async function POST(request: NextRequest) {
  try {
    const data: IncidentData = await request.json();

    if (!data.title || !data.description || !data.category || !data.priority) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Faltan campos requeridos: title, description, category, priority",
        },
        { status: 400 },
      );
    }

    if (
      !data.coordinates ||
      typeof data.coordinates.lat !== "number" ||
      typeof data.coordinates.lng !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Las coordenadas son requeridas y deben ser números válidos",
        },
        { status: 400 },
      );
    }

    const newIncident: Incident = {
      ...data,
      id: Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
      imageUrls: [],
    };

    console.log("Nueva incidencia creada:", newIncident);

    return NextResponse.json(
      {
        success: true,
        data: newIncident,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al crear incidencia:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al crear la incidencia",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error("Error al obtener incidencias:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
