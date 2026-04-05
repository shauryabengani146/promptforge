// components/ErrorMessage.jsx
import React from "react";

function ErrorMessage({ message, onDismiss }) {
    return (
        <div className="animate-slide-up w-full max-w-3xl mx-auto px-4 mb-6">
            <div
                className="relative flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10"
                style={{ boxShadow: "0 0 20px rgba(239, 68, 68, 0.1)" }}
            >
                <span className="text-xl flex-shrink-0">⚠️</span>

                <div className="flex-1 min-w-0">
                    <p className="text-red-400 text-sm font-medium mb-0.5">
                        Something went wrong
                    </p>
                    <p className="text-red-300/70 text-sm break-words">{message}</p>
                </div>

                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="flex-shrink-0 text-red-400/60 hover:text-red-400 transition-colors text-lg leading-none"
                        aria-label="Dismiss error"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}

export default ErrorMessage;