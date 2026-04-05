// components/OutputCard.jsx
import React, { useState } from "react";

function OutputCard({
    title,
    content,
    icon = "📋",
    accentColor = "cyan",
    variant = "default",
    rating,
    items,
    badge,
}) {
    const [copied, setCopied] = useState(false);

    const colorMap = {
        cyan: {
            border: "border-neon-cyan/20",
            glow: "rgba(0, 245, 255, 0.1)",
            text: "text-neon-cyan",
            badge: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
            bar: "bg-neon-cyan",
        },
        purple: {
            border: "border-neon-purple/20",
            glow: "rgba(191, 0, 255, 0.1)",
            text: "text-neon-purple",
            badge: "bg-neon-purple/10 text-neon-purple border-neon-purple/30",
            bar: "bg-neon-purple",
        },
        green: {
            border: "border-neon-green/20",
            glow: "rgba(0, 255, 136, 0.1)",
            text: "text-neon-green",
            badge: "bg-neon-green/10 text-neon-green border-neon-green/30",
            bar: "bg-neon-green",
        },
        pink: {
            border: "border-neon-pink/20",
            glow: "rgba(255, 0, 128, 0.1)",
            text: "text-neon-pink",
            badge: "bg-neon-pink/10 text-neon-pink border-neon-pink/30",
            bar: "bg-neon-pink",
        },
    };

    const colors = colorMap[accentColor] || colorMap.cyan;

    const handleCopy = async () => {
        const textToCopy = content || items?.join("\n") || "";
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div
            className={`relative rounded-xl border ${colors.border} bg-dark-700/50 backdrop-blur-sm p-5 animate-slide-up hover:border-opacity-40 transition-all duration-300`}
            style={{ boxShadow: `0 0 30px ${colors.glow}` }}
        >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <h3 className={`text-sm font-semibold ${colors.text} font-mono`}>
                        {title}
                    </h3>
                    {badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.badge}`}>
                            {badge}
                        </span>
                    )}
                </div>

                {(content || items) && (
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${copied
                                ? "border-neon-green/40 text-neon-green bg-neon-green/10"
                                : "border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20 bg-white/5"
                            }`}
                    >
                        <span>{copied ? "✓" : "⎘"}</span>
                        <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                )}
            </div>

            {/* Rating Variant */}
            {variant === "rating" && rating !== undefined && (
                <div className="space-y-3">
                    <div className="flex items-end gap-2">
                        <span className={`text-5xl font-bold ${colors.text} font-mono`}>
                            {rating}
                        </span>
                        <span className="text-gray-500 text-xl mb-1">/10</span>
                    </div>
                    <div className="h-2 bg-dark-500 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${colors.bar} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${rating * 10}%` }}
                        />
                    </div>
                    <p className="text-gray-400 text-xs">
                        {rating >= 8
                            ? "🌟 Excellent prompt!"
                            : rating >= 6
                                ? "👍 Good prompt with room to improve"
                                : rating >= 4
                                    ? "⚠️ Needs improvement"
                                    : "❌ Major issues found"}
                    </p>
                    {content && <p className="text-gray-300 text-sm mt-2">{content}</p>}
                </div>
            )}

            {/* List Variant */}
            {variant === "list" && items && (
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className={`${colors.text} mt-0.5 flex-shrink-0`}>→</span>
                            <span className="text-gray-300 text-sm">{item}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Default Variant */}
            {variant === "default" && content && (
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {content}
                </p>
            )}

            {/* Code Variant */}
            {variant === "code" && content && (
                <div className="bg-dark-800 rounded-lg p-4 border border-white/5">
                    <p className="text-gray-200 text-sm leading-relaxed font-mono whitespace-pre-wrap">
                        {content}
                    </p>
                </div>
            )}
        </div>
    );
}

export default OutputCard;