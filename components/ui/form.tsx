"use client";
import { useState } from "react";

export default function Form() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [optimizedResume, setOptimizedResume] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!resumeFile || !jdFile) {
      alert("Please select both a resume and a job description file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDescription", jdFile);

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setOptimizedResume(result.optimizedResume || "No response received.");
    } catch (error) {
      console.error("Error optimizing resume:", error);
      setOptimizedResume("Error optimizing resume.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Upload Resume:</label>
        <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
        
        <label>Upload Job Description:</label>
        <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={(e) => setJdFile(e.target.files?.[0] || null)} />
        
        <button type="submit">Optimize Resume</button>
      </form>

      {optimizedResume && (
        <div>
          <h3>Optimized Resume:</h3>
          <pre>{optimizedResume}</pre>
        </div>
      )}
    </div>
  );
}
