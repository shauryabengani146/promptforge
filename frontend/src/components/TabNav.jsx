// components/TabNav.jsx
import React from "react";

const TABS = [
    {
        id: "analyze",
        label: "Analyze",
        icon: "🔍",
        description: "Analyze & improve existing prompts",
    },
    {
        id: "generate",
        label: "Generate",
        icon: "✨",
        description: "Create new prompts from your goal",
    },
];

function TabNav({ activeTab, onTabChange }) {
    return (
        <div className="w-full max-w-2xl mx-auto px-4 mb-8">
            <div className="relative flex bg-dark-700 rounded-xl p-1 border border-white/5">
                {/* Sliding background indicator */}
                <div
                    className="absolute top-1 bottom-1 w-1/2 bg-dark-500 rounded-lg transition-all duration-300 ease-out border border-white/10"
                    style={{
                        left: activeTab === "analyze" ? "4px" : "calc(50% - 4px)",
                        boxShadow:
                            activeTab === "analyze"
                                ? "0 0 15px rgba(0, 245, 255, 0.15)"
                                : "0 0 15px rgba(191, 0, 255, 0.15)",
                    }}
                />

                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
              relative z-10 flex-1 flex items-center justify-center gap-2
              py-3 px-4 rounded-lg text-sm font-medium
              transition-all duration-300
              ${activeTab === tab.id
                                ? tab.id === "analyze"
                                    ? "text-neon-cyan"
                                    : "text-neon-purple"
                                : "text-gray-500 hover:text-gray-300"
                            }
            `}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <p className="text-center text-xs text-gray-600 mt-2">
                {TABS.find((t) => t.id === activeTab)?.description}
            </p>
        </div>
    );
}

export default TabNav;