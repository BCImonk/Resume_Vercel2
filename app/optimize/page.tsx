"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline"

export default function OptimizePage() {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onDrop = (acceptedFiles: File[], fileType: "resume" | "jobDescription") => {
    if (fileType === "resume") {
      setResume(acceptedFiles[0])
    } else {
      setJobDescription(acceptedFiles[0])
    }
  }

  const { getRootProps: getResumeRootProps, getInputProps: getResumeInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, "resume"),
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "text/plain": [".txt"],
    },
  })

  const { getRootProps: getJdRootProps, getInputProps: getJdInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, "jobDescription"),
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "text/plain": [".txt"],
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (resume && jobDescription) {
      setIsLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append("resume", resume)
      formData.append("jobDescription", jobDescription)

      try {
        const response = await fetch("/api/optimize", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to optimize resume")
        }

        const data = await response.json()
        router.push(`/results?resume=${encodeURIComponent(data.optimizedResume)}`)
      } catch (error) {
        setError("An error occurred while optimizing the resume. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Upload Your Files</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg mb-2">Resume</label>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              {...getResumeRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition duration-300"
            >
              <input {...getResumeInputProps()} />
              {resume ? (
                <p>{resume.name}</p>
              ) : (
                <div>
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p>Drag & drop your resume here, or click to select</p>
                </div>
              )}
            </motion.div>
          </div>
          <div>
            <label className="block text-lg mb-2">Job Description</label>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              {...getJdRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition duration-300"
            >
              <input {...getJdInputProps()} />
              {jobDescription ? (
                <p>{jobDescription.name}</p>
              ) : (
                <div>
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p>Drag & drop the job description here, or click to select</p>
                </div>
              )}
            </motion.div>
          </div>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-center">
              {error}
            </motion.p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !resume || !jobDescription}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 ${
              (isLoading || !resume || !jobDescription) && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Optimizing..." : "Optimize Resume"}
          </motion.button>
        </form>
      </motion.div>
    </main>
  )
}

