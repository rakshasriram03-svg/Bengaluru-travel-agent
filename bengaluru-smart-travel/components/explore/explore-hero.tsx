"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot } from "lucide-react";
import { CitySkylineBackdrop } from "@/components/explore/city-skyline-backdrop";
import { EXPLORE_SUGGESTIONS } from "@/lib/constants";
import { useChat } from "@/components/providers/chat-provider";

export function ExploreHero() {
  const [value, setValue] = useState("");
  const router = useRouter();
  const { sendMessage } = useChat();

  const submit = (text: string) => {
  alert("Submit called");

  const trimmed = text.trim();
  if (!trimmed) return;

  router.push("/dashboard");

  setTimeout(() => sendMessage(trimmed), 0);

  setValue("");
};
    

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center text-white">
      <CitySkylineBackdrop />

      <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> AI-Powered Exploration
      </span>

      <h1 className="mb-6 max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">
        Navigate the Garden City with Intelligence.
      </h1>
      <p className="mb-10 max-w-xl text-zinc-300">
        Experience Bengaluru like never before. From hidden local gems to optimized transit routes, our AI
        personalizes every step of your journey.
      </p>

      <div className="flex w-full max-w-xl items-center gap-3 rounded-full border border-zinc-700 bg-black/50 px-5 py-3 shadow-2xl backdrop-blur-xl">
        <Bot className="h-5 w-5 shrink-0 text-primary" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit(value)}
          placeholder="Where would you like to explore today?"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
        />
        <button
          onClick={() => submit(value)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary transition-colors hover:opacity-90"
          aria-label="Explore"
        >
          <ArrowRight className="h-4 w-4 text-white" />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {EXPLORE_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => submit(s)}
            className="rounded-full border border-zinc-700 bg-black/40 px-4 py-2 text-xs text-zinc-200 backdrop-blur transition-colors hover:border-primary/50 hover:text-primary sm:text-sm"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
