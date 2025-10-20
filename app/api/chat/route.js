import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI API key in environment!");
      return NextResponse.json(
        { error: "Server misconfiguration: missing API key" },
        { status: 500 }
      );
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
      }),
    });

    const data = await res.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn’t generate a response right now.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Server crash:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
