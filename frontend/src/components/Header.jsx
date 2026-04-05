// components/Header.jsx
import React from "react";

function Header() {
    return (
        <header className="w-full py-8 px-4 text-center relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />

            <div className="flex items-center justify-center gap-3 mb-3">
                <div className="relative">
                    <span className="text-4xl">⚡</span>
                    <div className="absolute inset-0 blur-xl bg-neon-cyan opacity-30 rounded-full" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="text-white">Prompt</span>
                    <span
                        className="text-neon-cyan"
                        style={{
                            textShadow:
                                "0 0 10px rgba(0, 245, 255, 0.8), 0 0 30px rgba(0, 245, 255, 0.4)",
                        }}
                    >
                        Forge
                    </span>
                </h1>
            </div>

            <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
                Analyze, improve, and generate AI prompts with the power of{" "}
                <span className="text-neon-cyan">GPT-4</span>
            </p>

            <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-xs text-gray-500">AI Engine Online</span>
            </div>
        </header>
    );
}

export default Header;