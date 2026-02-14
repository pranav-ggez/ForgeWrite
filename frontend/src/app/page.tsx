"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Github,
  Linkedin,
  Trash2,
  ChevronRight,
  X,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Home() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [hoveringToggle, setHoveringToggle] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  /* ================= LOAD HISTORY ================= */
  useEffect(() => {
    const saved = localStorage.getItem("fw_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  /* ================= MOUSE GLOW ================= */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* ================= TAGLINE ================= */
  const tagline = "Transform vague ideas into powerful prompts.";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (showPrompt) return;
    let i = 0;
    const id = setInterval(() => {
      setDisplayedText(tagline.slice(0, i++));
      if (i > tagline.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [showPrompt]);

  const toggleTheme = () => setDarkMode((p) => !p);

  /* ================= GENERATE ================= */
  const generatePrompt = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input }),
      });

      const data = await res.json();
      setResult(data);

      setHistory((prev) => {
        const updated = [input, ...prev.filter((p) => p !== input)].slice(0, 5);
        localStorage.setItem("fw_history", JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  const theme = {
    bg: darkMode ? "bg-black text-white" : "bg-neutral-50 text-black",
    textarea: darkMode
      ? "bg-neutral-900 border-neutral-700 text-white"
      : "bg-white border-neutral-300 text-black",
    sidebar: darkMode ? "bg-neutral-900" : "bg-white",
    overlay: darkMode ? "bg-black/40" : "bg-black/20",
  };

  return (
    <main className={`min-h-screen ${theme.bg} relative`}>
      <AnimatedBackground darkMode={darkMode} />

      {/* Mouse glow */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background: `radial-gradient(700px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 60%)`,
        }}
      />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full flex justify-between px-8 py-6 z-20">
        <div className="font-semibold ml-10">ForgeWrite</div>
        <div className="flex gap-6">
          <Github size={18} />
          <Linkedin size={18} />
        </div>
      </nav>

      {/* THEME BUTTON */}
      <div className="fixed right-6 bottom-6 z-20">
        <button
          onClick={toggleTheme}
          className="p-3 border rounded-full backdrop-blur hover:scale-110 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* SIDEBAR TOGGLE */}
      <button
        onClick={() => setHistoryOpen(true)}
        onMouseEnter={() => setHoveringToggle(true)}
        onMouseLeave={() => setHoveringToggle(false)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30
                   p-2 rounded-r-md border backdrop-blur
                   hover:scale-110 transition"
      >
        <ChevronRight size={18} />
      </button>

      {/* Hover spotlight */}
      {hoveringToggle && !historyOpen && (
        <div className="fixed inset-0 bg-black/10 z-20 pointer-events-none" />
      )}

      {/* ================= SIDEBAR ================= */}
      {historyOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Sidebar */}
          <div
            className={`w-72 ${theme.sidebar} border-r p-5 flex flex-col shadow-2xl`}
          >
            <div className="flex justify-between mb-4">
              <p className="text-sm font-semibold opacity-80">
                Prompt History
              </p>
              <button onClick={() => setHistoryOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {history.length === 0 && (
                <p className="text-xs opacity-40">No history! Write a prompt already?!</p>
              )}
              {history.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(item);
                    setShowPrompt(true);
                    setHistoryOpen(false);
                  }}
                  className="w-full text-left text-xs p-2 border rounded-md hover:bg-neutral-800/40 transition"
                >
                  {item}
                </button>
              ))}
            </div>

            {history.length > 0 && (
              <button
                onClick={() => {
                  localStorage.removeItem("fw_history");
                  setHistory([]);
                }}
                className="mt-4 text-xs border rounded-md py-2 hover:bg-red-500 hover:border-red-500 hover:text-white transition"
              >
                Clear History
              </button>
            )}
          </div>

          {/* Overlay */}
          <div
            className={`flex-1 ${theme.overlay} backdrop-blur-sm`}
            onClick={() => setHistoryOpen(false)}
          />
        </div>
      )}

      {/* HERO */}
{!showPrompt && (
  <div className="flex flex-col items-center justify-center h-screen text-center relative z-10">

    {/* Main Title */}
    <h1 className="text-7xl md:text-8xl font-semibold tracking-tight">
      ForgeWrite
    </h1>

    {/* Typing Tagline */}
    <p className="mt-6 text-base md:text-lg opacity-70 min-h-[28px]">
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>

    {/* CTA */}
    <button
      onClick={() => setShowPrompt(true)}
      className="mt-12 px-10 py-4 border rounded-full
                 hover:scale-105
                 hover:shadow-[0_0_35px_rgba(0,255,120,0.2)]
                 transition"
    >
      Begin Prompting
    </button>
  </div>
)}


      {/* PROMPT MODE */}
      {showPrompt && (
        <div className="max-w-2xl mx-auto pt-32 px-6 relative z-10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something vague..."
            className={`w-full h-40 p-6 border rounded-xl ${theme.textarea}`}
          />

          <div className="mt-8 flex gap-3">
            <button
              onClick={generatePrompt}
              className="flex-1 py-4 border rounded-xl
                         hover:scale-[1.02]
                         hover:shadow-[0_0_40px_rgba(0,255,120,0.2)]
                         transition"
            >
              {loading ? "Forging..." : "Forge Prompt"}
            </button>

            {result && (
              <button
                onClick={() => {
                  setResult(null);
                  setInput("");
                }}
                className="p-4 border rounded-xl hover:bg-red-500/10 transition"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {result && <PromptViewer result={result} />}
        </div>
      )}
    </main>
  );
}

/* ================= MODAL ================= */

function PromptViewer({ result }: any) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const text =
    typeof result.final_prompt === "string"
      ? result.final_prompt
      : JSON.stringify(result, null, 2);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forgewrite-prompt.txt";
    a.click();
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="mt-6 border p-4 rounded-xl cursor-pointer hover:scale-[1.01] transition"
      >
        <pre className="text-xs opacity-70 line-clamp-5">{text}</pre>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur flex items-center justify-center p-6">
          <div className="bg-neutral-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">

            {/* Sticky header */}
            <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={copy}
                className="text-sm border px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition"
              >
                {copied ? "Copied!" : "Copy"}
              </button>

              <button
                onClick={download}
                className="text-sm border px-3 py-1 rounded hover:bg-green-500 hover:text-white transition"
              >
                Download
              </button>

              <button
                onClick={() => setOpen(false)}
                className="text-sm border px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto px-8 py-6">
              <pre className="whitespace-pre-wrap text-sm">{text}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
