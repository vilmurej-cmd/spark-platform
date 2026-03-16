import { NextRequest, NextResponse } from "next/server";
import { DEMO_STORY } from "@/lib/spark-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childName, childAge, condition, favorites, companion, storyTone } = body;

    if (!childName || !condition) {
      return NextResponse.json({ success: false, error: "Name and condition required." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Personalize demo story
      const story = {
        ...DEMO_STORY,
        title: `${childName} and the Breathing Dragon`,
        dedication: `For ${childName}, who is braver than they know`,
        pages: DEMO_STORY.pages.map(p => ({
          ...p,
          text: p.text.replace(/\bSam\b/g, childName).replace(/\bSam's\b/g, `${childName}'s`),
        })),
      };
      return NextResponse.json({ success: true, story });
    }

    // Build prompt
    const age = Number(childAge) || 7;
    const favStr = favorites?.length ? favorites.join(", ") : "not specified";
    const compStr = companion?.name ? `${companion.name} (${companion.type})` : "none";
    const pageGuide = age <= 5 ? "8 pages, very simple" : age <= 8 ? "10-12 pages" : "12-14 pages";

    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 6000,
      temperature: 0.85,
      messages: [
        { role: "system", content: `You are a beloved children's book author writing for SPARK, the Children's Health Empowerment Platform. Write with warmth of Mr. Rogers, imagination of Dr. Seuss, truth of Pixar.\n\nChild: ${childName}, age ${age}, condition: ${condition}\nFavorites: ${favStr}\nCompanion: ${compStr}\nTone: ${storyTone || "adventure"}\n\nRULES:\n1. ${childName} is the HERO.\n2. The condition gives them a unique strength.\n3. Treatment is their SUPERPOWER TOOL.\n4. Include their favorites naturally.\n5. Age-appropriate: ${pageGuide}\n6. Moment of BRAVERY as climax.\n7. End with PRIDE and PEACE.\n8. NEVER scary. NEVER make them feel broken.\n9. Each page has illustration description.\n\nRespond with ONLY valid JSON:\n{"title":"...","dedication":"For ${childName}...","pages":[{"pageNumber":1,"text":"...","illustration":{"description":"...","mood":"...","colors":["#hex","#hex","#hex"]}}],"aboutTheCondition":{"forKids":"...","forParents":"..."}}` },
        { role: "user", content: `Write a personalized storybook for ${childName}.` },
      ],
    });

    const story = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return NextResponse.json({ success: true, story });
  } catch (error) {
    console.error("Story API error:", error);
    const body = await request.clone().json().catch(() => ({}));
    const name = (body as Record<string, string>).childName || "Sam";
    const story = {
      ...DEMO_STORY,
      title: `${name} and the Breathing Dragon`,
      dedication: `For ${name}, who is braver than they know`,
      pages: DEMO_STORY.pages.map(p => ({ ...p, text: p.text.replace(/\bSam\b/g, name) })),
    };
    return NextResponse.json({ success: true, story });
  }
}
