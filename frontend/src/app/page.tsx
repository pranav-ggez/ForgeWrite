"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, ArrowLeft, Github, Linkedin } from "lucide-react";

export default function Home() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fullTagline =
    "Transform vague ideas into powerful prompts.";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (showPrompt) return;

    let index = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      setDisplayedText(fullTagline.slice(0, index + 1));
      index++;
      if (index === fullTagline.length) clearInterval(interval);
    }, 110);

    return () => clearInterval(interval);
  }, [showPrompt]);

  useEffect(() => {
    if (showPrompt) {
      setTimeout(() => {
        document.querySelector("textarea")?.focus();
      }, 200);
    }
  }, [showPrompt]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const generatePrompt = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Something went wrong.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
  // Silently ignore network errors
  console.error("API Error:", err);
}


    setLoading(false);
  };

  const themeStyles = {
    background: darkMode
      ? "bg-black text-white"
      : "bg-neutral-50 text-black",

    textarea: darkMode
      ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500"
      : "bg-white border-neutral-300 text-black placeholder-neutral-500",

    card: darkMode
      ? "bg-neutral-900 border-neutral-700"
      : "bg-white border-neutral-300",

    glow: darkMode
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.08)",
  };

  return (
    <main
  className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
    themeStyles.background
  } ${darkMode ? "dark-selection" : "light-selection"}`}
>

      {/* Mouse Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(
            700px at ${mousePosition.x}px ${mousePosition.y}px,
            ${themeStyles.glow},
            transparent 60%
          )`,
        }}
      />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-6 z-20">
        <div className="text-lg font-semibold tracking-wide">
          ForgeWrite
        </div>

        <div className="flex items-center gap-6 text-sm">
          <a
            href="https://github.com/pranav-ggez"
            target="_blank"
            className="flex items-center gap-2 hover:opacity-70 transition"
          >
            <Github size={18} />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/pranav-vaidya-025326255/"
            target="_blank"
            className="flex items-center gap-2 hover:opacity-70 transition"
          >
            <Linkedin size={18} />
            Contact
          </a>
        </div>
      </nav>

      {/* Controls (Left Side) */}
      <div className="fixed left-6 bottom-6 flex flex-col gap-4 z-20">
        <button
          onClick={toggleTheme}
          className="p-3 border rounded-full hover:scale-110 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {showPrompt && (
          <button
            onClick={() => {
              setShowPrompt(false);
              setResult(null);
              setInput("");
            }}
            className="p-3 border rounded-full hover:scale-110 transition"
          >
            <ArrowLeft size={18} />
          </button>
        )}
      </div>

      {/* HERO */}
      {!showPrompt && (
        <div className="text-center px-6 z-10 animate-fadeIn mt-20">
          <h1 className="text-6xl md:text-8xl tracking-tight">
            ForgeWrite
          </h1>

          <p className="mt-6 text-base opacity-70 min-h-8">
            {displayedText}
            <span className="animate-pulse">|</span>
          </p>

          <button
            onClick={() => setShowPrompt(true)}
            className="mt-12 px-10 py-4 border rounded-full text-base 
                       hover:scale-105 
                       hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]
                       transition duration-300"
          >
            Begin Prompting
          </button>
        </div>
      )}

      {/* PROMPT */}
      {showPrompt && (
        <div className="w-full max-w-2xl text-center px-6 z-10 animate-fadeIn mt-24">

          <textarea
            placeholder="Type something vague..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full h-40 p-6 border rounded-xl text-base transition ${themeStyles.textarea}`}
          />

          <button
            onClick={generatePrompt}
            className="mt-8 w-full py-4 border rounded-xl text-base 
                       hover:scale-105 
                       hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]
                       transition duration-300"
          >
            {loading ? "Forging..." : "Forge Prompt"}
          </button>

          {/* {error && (
            <p className="mt-4 text-red-500 text-base">
              {error}
            </p>
          )} */}

          {result && (
            <div
              className={`mt-10 p-8 border rounded-xl text-base whitespace-pre-wrap transition ${themeStyles.card}`}
            >
              {result.final_prompt}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
