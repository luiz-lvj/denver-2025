import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    console.log("Received message:", message);
    console.log("WAAAS_SERVER_URL:", process.env.WAAAS_SERVER_URL);
    const response = await fetch(`${process.env.WAAAS_SERVER_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, sessionId }),
    });

    const data = await response.json();
    console.log("Response from server:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
