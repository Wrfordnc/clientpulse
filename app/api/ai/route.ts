import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is missing from environment variables." },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey,
    });

    const body = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an executive relationship intelligence assistant for Pulse.",
        },
        {
          role: "user",
          content: body.prompt,
        },
      ],
      temperature: 0.7,
    });

    return Response.json({
      output: completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}