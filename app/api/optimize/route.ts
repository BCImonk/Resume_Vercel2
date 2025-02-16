import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Helper function to extract text from a file upload.
 * It supports plain text, PDF, and Word documents.
 */
async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name;
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (ext === "txt") {
    // For plain text files, read directly.
    return await file.text();
  } else if (ext === "pdf") {
    // Convert the file to a Node Buffer and parse the PDF.
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdf = await pdfParse(buffer);
    return pdf.text;
  } else if (ext === "doc" || ext === "docx") {
    // Use mammoth to extract text from Word documents.
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    // For other formats, attempt to read as text.
    return await file.text();
  }
}

export async function POST(req: Request) {
  try {
    // Parse the incoming multipart/form-data.
    const formData = await req.formData();
    const resumeFile = formData.get("resume");
    const jdFile = formData.get("jobDescription");

    if (
      !resumeFile ||
      !jdFile ||
      !(resumeFile instanceof File) ||
      !(jdFile instanceof File)
    ) {
      return NextResponse.json(
        { error: "Missing file(s) in request. Please upload both a resume and a job description." },
        { status: 400 }
      );
    }

    // Extract text from both uploaded files.
    const resumeText = await extractTextFromFile(resumeFile);
    const jdText = await extractTextFromFile(jdFile);

    // Retrieve the API key from environment variables.
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      console.error("Error: API key is missing.");
      return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    // Make the API call to Mistral.
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are an expert in ATS resume optimization." },
          { role: "user", content: `Optimize this resume: ${resumeText} for this job: ${jdText}` }
        ]
      })
    });

    // Read and log the raw API response for debugging.
    const rawResponse = await response.text();
    console.log("Mistral API Raw Response:", rawResponse);

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const data = JSON.parse(rawResponse);
        if (!response.ok) {
          console.error("Mistral API Error:", data);
          return NextResponse.json(
            { error: "Error from Mistral API", details: data },
            { status: response.status }
          );
        }
        return NextResponse.json({
          optimizedResume: data.choices?.[0]?.message?.content || "Error processing response."
        });
      } catch (jsonError) {
        console.error("Failed to parse JSON from Mistral:", jsonError);
        return NextResponse.json(
          { error: "Invalid JSON response from Mistral", details: rawResponse },
          { status: 500 }
        );
      }
    } else {
      console.error("Unexpected content-type:", contentType);
      return NextResponse.json(
        { error: "Unexpected response type from Mistral", details: rawResponse },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to optimize resume", details: String(error) },
      { status: 500 }
    );
  }
}
