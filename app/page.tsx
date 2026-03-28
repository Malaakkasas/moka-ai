"use client";

import { FormEvent, useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setImageUrl(data.image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0e0b14] text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center gap-2 px-8 py-5 border-b border-white/5">
        <img src="/moka.png" alt="Moka AI" className="w-8 h-8 rounded-lg object-cover" />
        <span className="font-semibold text-lg tracking-tight">Moka AI</span>
      </nav>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — prompt panel */}
        <div className="w-[420px] shrink-0 border-r border-white/5 flex flex-col p-8 gap-6 bg-[#110d1a]">
          <div>
            <h2 className="text-xl font-semibold text-[#e2d9f3] mb-1">Create an image</h2>
            <p className="text-sm text-[#7c6f9a]">Describe what you want to see</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
            <textarea
              className="flex-1 min-h-[200px] bg-[#1a1228] border border-[#3d2f5e] rounded-2xl p-4 text-sm text-[#e2d9f3] placeholder-[#4a3d6a] resize-none focus:outline-none focus:ring-2 focus:ring-[#a855f7]/40 transition"
              placeholder="A dreamy lilac forest at dusk, soft glowing lights, cinematic, ultra detailed..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#a855f7] to-[#818cf8] text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-lg shadow-purple-900/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Image"
              )}
            </button>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-xs">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Right — image panel */}
        <div className="flex-1 flex items-center justify-center p-10 bg-[#0e0b14]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-[#7c6f9a]">
              <div className="w-12 h-12 rounded-full border-2 border-[#a855f7] border-t-transparent animate-spin" />
              <p className="text-sm">Brewing your image...</p>
            </div>
          ) : imageUrl ? (
            <div className="flex flex-col items-center gap-4 w-full max-w-xl">
              <div className="rounded-2xl overflow-hidden border border-[#3d2f5e] shadow-2xl shadow-purple-950/50 w-full">
                <img src={imageUrl} alt="Generated result" className="w-full" />
              </div>
              <a
                href={imageUrl}
                download="moka-image.png"
                className="text-xs px-4 py-2 rounded-xl border border-[#3d2f5e] text-[#c084fc] hover:bg-[#1a1228] transition"
              >
                Download image
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-[#3d2f5e]">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className="text-sm">Your image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
