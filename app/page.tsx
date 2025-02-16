"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-6">Resume Optimizer</h1>
        <p className="text-xl mb-8">Optimize your resume for ATS and specific job descriptions</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/optimize"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Get Started
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Number.POSITIVE_INFINITY,
        }}
        className="absolute -z-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20"
      />
    </main>
  )
}

