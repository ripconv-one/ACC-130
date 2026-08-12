import { NextResponse } from "next/server";

const AGENT_API_URL =
  process.env.AGENT_API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${AGENT_API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to contact agent API:", error);

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