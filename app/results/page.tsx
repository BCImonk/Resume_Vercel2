"use client";

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ResultsPage() {
  const [optimizedResume, setOptimizedResume] = useState<string>("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const resumeParam = searchParams.get("resume")
    if (resumeParam) {
      setOptimizedResume(decodeURIComponent(resumeParam))
    }
  }, [searchParams])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Optimized Resume</h1>
        {optimizedResume ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <pre className="bg-gray-800 p-6 rounded-lg whitespace-pre-wrap">{optimizedResume}</pre>
            <div className="mt-8 flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                onClick={() => {
                  const blob = new Blob([optimizedResume], { type: "text/plain" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "optimized_resume.txt"
                  a.click()
                }}
              >
                Download Resume
              </motion.button>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  Start Over
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Number.POSITIVE_INFINITY,
            }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
        )}
      </motion.div>
    </main>
  )
}

