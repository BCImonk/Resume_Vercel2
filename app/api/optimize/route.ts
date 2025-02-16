import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { resume, jobDescription } = await req.json();
        
        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            console.error("Error: API key is missing.");
            return NextResponse.json({ error: "API key is missing" }, { status: 500 });
        }

        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages: [
                    { role: "system", content: "You are an expert in ATS resume optimization." },
                    { role: "user", content: `Optimize this resume: ${resume} for this job: ${jobDescription}` }
                ]
            })
        });

        const data = await response.json();

        // Log API response for debugging
        console.log("Mistral API Response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.error("Error: Mistral API returned an error.", data);
            return NextResponse.json({ error: "Error from Mistral API", details: data }, { status: response.status });
        }

        return NextResponse.json({ optimizedResume: data.choices?.[0]?.message?.content || "Error processing response." });

    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Failed to optimize resume", details: error }, { status: 500 });
    }
}
