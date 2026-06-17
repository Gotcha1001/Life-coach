"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Sparkles, ScrollText } from "lucide-react";
import { CrystalBall } from "../components/CrystalBall";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-3"
      >
        <div className="flex justify-center mb-6 animate-float">
          <CrystalBall size="sm" glowing />
        </div>
        <p className="text-fuchsia-400 font-serif text-xs tracking-[0.5em] uppercase">
          ✦ Welcome back ✦
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-white glow-text">
          {user?.firstName ? `${user.firstName}'s Sanctuary` : "Your Sanctuary"}
        </h1>
        <p className="text-purple-300/70 font-body text-base max-w-md mx-auto">
          The universe has been waiting. Are you ready to hear your soul speak?
        </p>
        <div className="mystical-divider max-w-xs mx-auto" />
      </motion.div>

      {/* Single hero card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        whileHover={{ y: -6 }}
        className="w-full max-w-md"
      >
        <Link href="/dashboard/soul">
          <div
            className="mystical-card rounded-2xl p-10 cursor-pointer border border-fuchsia-500/30 hover:border-fuchsia-400/60 transition-all duration-500"
            style={{
              background:
                "linear-gradient(135deg, rgba(112,26,117,0.8), rgba(88,28,135,0.8))",
            }}
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, rgba(232,121,249,0.4) 0%, transparent 70%)",
                  boxShadow: "0 0 40px rgba(232,121,249,0.4)",
                }}
              >
                <Sparkles className="w-10 h-10 text-fuchsia-300" />
              </motion.div>

              <div>
                <h2 className="font-serif text-3xl text-white mb-2">
                  Soul Contract
                </h2>
                <p className="text-xs text-fuchsia-300 font-serif tracking-widest uppercase">
                  Purpose · Mission · Destiny · Truth
                </p>
              </div>

              <p className="text-purple-200/70 font-body text-sm leading-relaxed">
                Answer 5 sacred questions and receive a deeply personal scroll
                revealing your soul&apos;s mission — the reason you are here.
              </p>

              <div className="px-8 py-3 rounded-full text-sm font-serif text-fuchsia-300 border border-fuchsia-500/40 hover:border-fuchsia-400 transition-colors">
                Begin the Journey →
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Link to history */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Link
          href="/dashboard/history"
          className="flex items-center gap-2 text-purple-500 hover:text-purple-300 text-sm font-serif transition-colors"
        >
          <ScrollText className="w-4 h-4" />
          View your ancient scrolls
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 text-purple-700 text-xs font-body italic text-center"
      >
        To know thyself is to know the universe
      </motion.p>
    </div>
  );
}
