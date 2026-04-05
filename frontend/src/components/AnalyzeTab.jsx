// components/AnalyzeTab.jsx
import React, { useState } from "react";
import { analyzePrompt } from "../utils/api";
import { useApi } from "../hooks/useApi";
import OutputCard from "./OutputCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const EXAMPLE_PROMPTS = [
    "Write me a story",
    "Help me with my code",
    "Explain machine learning to me like I'm 5 years old using fun analogies",
];

function AnalyzeTab() {
    const [inputPrompt, setInputPrompt] = useState("");
    const { data, loading, error, execute, reset } = useApi(analyzePrompt);

    const handleAnalyze = async () => {
        if (!inputPrompt.trim()) return;
        await execute(inputPrompt);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleAnalyze();
        }
    };

    const loadExample = (example) => {
        setInputPrompt(example);
        reset();
    };

    const charCount = inputPrompt.length;
    const maxChars = 2000;
    const isOverLimit = charCount > maxChars;

    return (
        <div className="w-full max-w-3xl mx-auto px-4 pb-16">
            {/* Input Section */}
            <div className="mb-6">
                <div
                    className="relative rounded-xl border border-neon-cyan/20 bg-dark-700/50 overflow-hidden"
                    style={{ boxShadow: "0 0 30px rgba(0, 245, 255, 0.05)" }}
                >
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                        <span className="text-xs text-neon-cyan font-mono">prompt_input.txt</span>
                        <span className={`text-xs font-mono ${isOverLimit ? "text-red-400" : "text-gray-600"}`}>
                            {charCount}/{maxChars}
                        </span>
                    </div>

                    <textarea
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Paste your AI prompt here... (Ctrl+Enter to analyze)"
                        rows={6}
                        className="w-full bg-transparent px-4 py-4 text-gray-200 placeholder-gray-600 text-sm resize-none focus:outline-none font-mono"
                    />

                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-dark-800/50">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-600">Try:</span>
                            {EXAMPLE_PROMPTS.map((example, i) => (
                                <button
                                    key={i}
                                    onClick={() => loadExample(example)}
                                    className="text-xs text-gray-500 hover:text-neon-cyan transition-colors px-2 py-1 rounded border border-white/5 hover:border-neon-cyan/20 bg-white/5"
                                >
                                    {example.length > 20 ? example.slice(0, 20) + "..." : example}
                                </button>
                            ))}
                        </div>
                        {inputPrompt && (
                            <button
                                onClick={() => { setInputPrompt(""); reset(); }}
                                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={loading || !inputPrompt.trim() || isOverLimit}
                    className={`w-full mt-3 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${loading || !inputPrompt.trim() || isOverLimit
                            ? "bg-dark-600 text-gray-600 cursor-not-allowed border border-white/5"
                            : "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan/20 hover:border-neon-cyan/60 cursor-pointer"
                        }`}
                    style={!loading && inputPrompt.trim() && !isOverLimit
                        ? { boxShadow: "0 0 20px rgba(0, 245, 255, 0.15)" }
                        : {}}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">⟳</span> Analyzing...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <span>🔍</span> Analyze Prompt
                        </span>
                    )}
                </button>
            </div>

            {loading && <LoadingSpinner message="Analyzing your prompt..." />}
            {error && !loading && <ErrorMessage message={error} onDismiss={reset} />}

            {data && !loading && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-cyan/30" />
                        <span className="text-xs text-neon-cyan font-mono uppercase tracking-widest">
                            Analysis Results
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-cyan/30" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <OutputCard
                            title="Quality Rating"
                            icon="⭐"
                            accentColor="cyan"
                            variant="rating"
                            rating={data.rating}
                            content={data.ratingExplanation}
                        />
                        {data.issues && data.issues.length > 0 && (
                            <OutputCard
                                title="Issues Found"
                                icon="⚠️"
                                accentColor="pink"
                                variant="list"
                                items={data.issues}
                                badge={`${data.issues.length} issue${data.issues.length !== 1 ? "s" : ""}`}
                                content={data.issues.join("\n")}
                            />
                        )}
                    </div>

                    {data.strengths && data.strengths.length > 0 && (
                        <OutputCard
                            title="Strengths"
                            icon="💪"
                            accentColor="green"
                            variant="list"
                            items={data.strengths}
                            content={data.strengths.join("\n")}
                        />
                    )}

                    <OutputCard
                        title="Improved Prompt"
                        icon="✨"
                        accentColor="cyan"
                        variant="code"
                        content={data.improvedPrompt}
                        badge="Recommended"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <OutputCard
                            title="Beginner Alternative"
                            icon="🌱"
                            accentColor="green"
                            variant="code"
                            content={data.beginnerAlternative}
                            badge="Simple"
                        />
                        <OutputCard
                            title="Advanced Alternative"
                            icon="🚀"
                            accentColor="purple"
                            variant="code"
                            content={data.advancedAlternative}
                            badge="Expert"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnalyzeTab;