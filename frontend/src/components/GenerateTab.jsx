// components/GenerateTab.jsx
import React, { useState } from "react";
import { generatePrompts } from "../utils/api";
import { useApi } from "../hooks/useApi";
import OutputCard from "./OutputCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const EXAMPLE_GOALS = [
    "Write a cover letter for a software engineering job",
    "Debug my Python code",
    "Create a marketing email for my product",
];

function GenerateTab() {
    const [inputGoal, setInputGoal] = useState("");
    const { data, loading, error, execute, reset } = useApi(generatePrompts);

    const handleGenerate = async () => {
        if (!inputGoal.trim()) return;
        await execute(inputGoal);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleGenerate();
        }
    };

    const loadExample = (example) => {
        setInputGoal(example);
        reset();
    };

    const charCount = inputGoal.length;
    const maxChars = 1000;
    const isOverLimit = charCount > maxChars;

    return (
        <div className="w-full max-w-3xl mx-auto px-4 pb-16">
            {/* Input Section */}
            <div className="mb-6">
                <div
                    className="relative rounded-xl border border-neon-purple/20 bg-dark-700/50 overflow-hidden"
                    style={{ boxShadow: "0 0 30px rgba(191, 0, 255, 0.05)" }}
                >
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                        <span className="text-xs text-neon-purple font-mono">goal_input.txt</span>
                        <span className={`text-xs font-mono ${isOverLimit ? "text-red-400" : "text-gray-600"}`}>
                            {charCount}/{maxChars}
                        </span>
                    </div>

                    <textarea
                        value={inputGoal}
                        onChange={(e) => setInputGoal(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe what you want to achieve..."
                        rows={5}
                        className="w-full bg-transparent px-4 py-4 text-gray-200 placeholder-gray-600 text-sm resize-none focus:outline-none"
                    />

                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-dark-800/50">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-600">Try:</span>
                            {EXAMPLE_GOALS.map((goal, i) => (
                                <button
                                    key={i}
                                    onClick={() => loadExample(goal)}
                                    className="text-xs text-gray-500 hover:text-neon-purple transition-colors px-2 py-1 rounded border border-white/5 hover:border-neon-purple/20 bg-white/5"
                                >
                                    {goal.length > 25 ? goal.slice(0, 25) + "..." : goal}
                                </button>
                            ))}
                        </div>
                        {inputGoal && (
                            <button
                                onClick={() => { setInputGoal(""); reset(); }}
                                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !inputGoal.trim() || isOverLimit}
                    className={`w-full mt-3 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${loading || !inputGoal.trim() || isOverLimit
                            ? "bg-dark-600 text-gray-600 cursor-not-allowed border border-white/5"
                            : "bg-neon-purple/10 text-neon-purple border border-neon-purple/40 hover:bg-neon-purple/20 hover:border-neon-purple/60 cursor-pointer"
                        }`}
                    style={!loading && inputGoal.trim() && !isOverLimit
                        ? { boxShadow: "0 0 20px rgba(191, 0, 255, 0.15)" }
                        : {}}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin">⟳</span> Generating...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <span>✨</span> Generate Prompts
                        </span>
                    )}
                </button>
            </div>

            {loading && <LoadingSpinner message="Generating prompt variations..." />}
            {error && !loading && <ErrorMessage message={error} onDismiss={reset} />}

            {data && !loading && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-purple/30" />
                        <span className="text-xs text-neon-purple font-mono uppercase tracking-widest">
                            Generated Prompts
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-purple/30" />
                    </div>

                    {data.goalSummary && (
                        <div className="text-center py-2">
                            <p className="text-gray-500 text-xs">
                                Generating prompts for:{" "}
                                <span className="text-gray-300">{data.goalSummary}</span>
                            </p>
                        </div>
                    )}

                    <OutputCard
                        title={data.standardPrompt?.title || "Standard Prompt"}
                        icon="📝"
                        accentColor="cyan"
                        variant="code"
                        content={data.standardPrompt?.prompt}
                        badge="Recommended"
                    />

                    {data.standardPrompt?.explanation && (
                        <p className="text-xs text-gray-600 px-2">
                            💡 {data.standardPrompt.explanation}
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <OutputCard
                                title={data.beginnerPrompt?.title || "Beginner Prompt"}
                                icon="🌱"
                                accentColor="green"
                                variant="code"
                                content={data.beginnerPrompt?.prompt}
                                badge="Simple"
                            />
                            {data.beginnerPrompt?.explanation && (
                                <p className="text-xs text-gray-600 px-2">
                                    💡 {data.beginnerPrompt.explanation}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <OutputCard
                                title={data.advancedPrompt?.title || "Advanced Prompt"}
                                icon="🚀"
                                accentColor="purple"
                                variant="code"
                                content={data.advancedPrompt?.prompt}
                                badge="Expert"
                            />
                            {data.advancedPrompt?.explanation && (
                                <p className="text-xs text-gray-600 px-2">
                                    💡 {data.advancedPrompt.explanation}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 p-4 rounded-xl border border-white/5 bg-dark-800/30">
                        <p className="text-xs text-gray-500 mb-2 font-mono">// PRO TIPS</p>
                        <ul className="space-y-1">
                            {[
                                "Start with the Standard prompt and iterate based on results",
                                "Use the Advanced prompt for complex tasks needing precision",
                                "The Beginner prompt is great for quick, no-fuss results",
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                    <span className="text-neon-purple/60 mt-0.5">→</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GenerateTab;