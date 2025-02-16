import { type NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resume = formData.get("resume") as File; // 🚨 Typo? "resume" vs "resume"
    const jobDescription = formData.get("jobDescription") as File;

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Missing resume or job description" },
        { status: 400 }
      );
    }

    const resumeText = await resume.text();
    const jobDescriptionText = await jobDescription.text();

    const prompt = `Given the following resume and job description, create an optimized one-page resume that is ATS-friendly and keyword-rich:

      Resume:
      ${resumeText}

      Job Description:
      ${jobDescriptionText}

      Please format the optimized resume in a clear, professional manner.`; // Same as before

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ✅ Use a validated model
      messages: [{ role: "user", content: prompt }],
    });

    const optimizedResume = completion.choices[0].message.content;
    return NextResponse.json({ optimizedResume });
  } catch (error) {
    console.error("Error optimizing resume:", error);
    return NextResponse.json(
      { error: "Error optimizing resume" },
      { status: 500 }
    );
  }
}
