import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    console.log("Nueva incidencia recibida:", data);

    return NextResponse.json({
      success: true,
      message: "Incidencia creada exitosamente",
      data: {
        id: Date.now(),
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error al crear incidencia:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear la incidencia" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [],
  });
}
