import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    console.log(" Incoming message:", message);
    console.log(" OpenAI key exists?", !!process.env.OPENAI_API_KEY);

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
               "You are Sameer Shah’s friendly AI assistant for his portfolio website. \
                You can introduce yourself as 'Sameer’s AI assistant'. \
                You know all about Sameer’s skills, projects, and experience. \
                You can chat casually but keep it professional and relevant to Sameer’s work.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(" OpenAI API error:", res.status, errorText);
      return NextResponse.json(
        { error: "OpenAI request failed." },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("OpenAI response:", data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn’t generate a response right now.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(" Server crash:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
