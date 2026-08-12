import { NextResponse } from "next/server";

const AGENT_API_URL =
  process.env.AGENT_API_URL ?? "http://127.0.0.1:8000";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  try {
    const response = await fetch(
      `${AGENT_API_URL}/tasks/${encodeURIComponent(id)}/events`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Failed to retrieve task events:", error);

    return NextResponse.json(
      {
        error: "Agent API is unavailable.",
      },
      {
        status: 503,
      }
    );
  }
}