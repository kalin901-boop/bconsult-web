import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Ти си полезен виртуален асистент на Б-Консулт. Отговаряй на български език, учтиво и професионално. Помагай с информация за счетоводни, административни и застрахователни услуги.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      reply: completion.choices[0]?.message?.content || "Няма отговор.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Възникна проблем при връзката с асистента." },
      { status: 500 }
    );
  }
}
