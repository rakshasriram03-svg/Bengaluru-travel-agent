"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Bot, CloudSun, MapPin, Sparkles } from "lucide-react";
import { CitySkylineBackdrop } from "@/components/explore/city-skyline-backdrop";
import { DaySkyBackdrop } from "@/components/explore/day-sky-backdrop";
import { EXPLORE_SUGGESTIONS } from "@/lib/constants";
import { useChat } from "@/components/providers/chat-provider";

const floatingBadges = [
  { icon: MapPin, label: "500+ places mapped", className: "left-8 top-8 hidden lg:flex" },
  { icon: CloudSun, label: "Live weather aware", className: "right-8 top-8 hidden lg:flex" },
  { icon: Sparkles, label: "24/7 AI assistant", className: "left-8 bottom-8 hidden lg:flex" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function ExploreHero() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const { sendMessage, dark } = useChat();

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    router.push("/dashboard");
    setTimeout(() => sendMessage(trimmed), 0);
    setValue("");
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center text-foreground">
      {dark ? <CitySkylineBackdrop /> : <DaySkyBackdrop />}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-mesh" />

      {floatingBadges.map(({ icon: Icon, label, className }) => (
        <motion.div
          key={label}
          aria-hidden
          className={`pointer-events-none absolute z-10 items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-2 text-xs font-medium text-muted-foreground shadow-glow backdrop-blur-md ${className}`}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="h-3.5 w-3.5 text-accent-glow" />
          {label}
        </motion.div>
      ))}

      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
        <motion.span
          variants={item}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> AI-Powered Exploration
        </motion.span>

        <motion.h1 variants={item} className="mb-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Navigate the Garden City with{" "}
          <span className="bg-gradient-to-r from-primary to-accent-glow bg-clip-text text-transparent">Intelligence.</span>
        </motion.h1>
        <motion.p variants={item} className="mb-10 max-w-xl text-muted-foreground">
          Experience Bengaluru like never before. From hidden local gems to optimized transit routes, our AI
          personalizes every step of your journey.
        </motion.p>

        <motion.div
          variants={item}
          className="flex w-full max-w-xl items-center gap-3 rounded-full border border-border bg-card/70 px-5 py-3 shadow-2xl backdrop-blur-xl transition-shadow focus-within:border-primary/50 focus-within:shadow-glow"
        >
          <Bot className="h-5 w-5 shrink-0 text-primary" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit(value)}
            placeholder="Where would you like to explore today?"
            aria-label="Ask the Bengaluru travel assistant"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => submit(value)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary transition-colors hover:opacity-90"
            aria-label="Explore"
          >
            <ArrowRight className="h-4 w-4 text-white" />
          </motion.button>
        </motion.div>

        <motion.div variants={item} className="mt-6 flex flex-wrap justify-center gap-3">
          {EXPLORE_SUGGESTIONS.map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => submit(s)}
              className="rounded-full border border-border bg-card/50 px-4 py-2 text-xs text-foreground/80 backdrop-blur transition-colors hover:border-primary/50 hover:text-primary sm:text-sm"
            >
              {s}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
