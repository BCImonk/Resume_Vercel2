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

        const rawText = await response.text(); // Read as text to avoid JSON errors
        console.log("Mistral API Raw Response:", rawText);

        try {
            const data = JSON.parse(rawText); // Now attempt to parse JSON
            if (!response.ok) {
                console.error("Mistral API Error:", data);
                return NextResponse.json({ error: "Error from Mistral API", details: data }, { status: response.status });
            }
            return NextResponse.json({ optimizedResume: data.choices?.[0]?.message?.content || "Error processing response." });
        } catch (jsonError) {
            console.error("Failed to parse JSON from Mistral:", jsonError);
            return NextResponse.json({ error: "Invalid response from Mistral", details: rawText }, { status: 500 });
        }

    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ error: "Failed to optimize resume", details: String(error) }, { status: 500 });
    }
}
