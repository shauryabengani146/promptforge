// components/LoadingSpinner.jsx
import React from "react";

function LoadingSpinner({ message = "Processing..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/20" />
                <div
                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-cyan animate-spin"
                    style={{ animationDuration: "1s" }}
                />
                <div
                    className="absolute inset-3 rounded-full border-2 border-transparent border-t-neon-purple animate-spin"
                    style={{ animationDuration: "0.7s", animationDirection: "reverse" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse" />
                </div>
            </div>

            <p className="text-neon-cyan text-sm font-mono animate-pulse">{message}</p>
            <p className="text-gray-600 text-xs mt-1">AI is thinking...</p>

            <div className="flex gap-1 mt-4">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-neon-cyan/40 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

export default LoadingSpinner;