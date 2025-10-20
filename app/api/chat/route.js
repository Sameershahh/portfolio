import { NextResponse } from "next/server";

export const runtime = "edge"; 

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error(" Missing OpenAI API key!");
      return NextResponse.json(
        { error: "Server misconfiguration: missing API key" },
        { status: 500 }
      );
    }

    // ⏱ Timeout setup (abort after 8 seconds)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    console.log(" Sending message to OpenAI:", message);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Sameer Shah’s AI assistant. Be professional but conversational. You know all about his skills and experience.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(" OpenAI API error:", res.status, errorText);
      return NextResponse.json(
        { error: "OpenAI request failed." },
        { status: res.status }
      );
    }

    const data = await res.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn’t generate a response right now.";

    console.log(" OpenAI reply:", reply);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(" Server crash or timeout:", error.name, error.message);
    return NextResponse.json(
      {
        error:
          error.name === "AbortError"
            ? "Request to OpenAI timed out. Please try again."
            : "Internal server error.",
      },
      { status: 500 }
    );
  }
}
