// App.jsx
import React, { useState } from "react";
import Header from "./components/Header";
import TabNav from "./components/TabNav";
import AnalyzeTab from "./components/AnalyzeTab";
import GenerateTab from "./components/GenerateTab";

function App() {
  const [activeTab, setActiveTab] = useState("analyze");

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Ambient background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00f5ff 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #bf00ff 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #00f5ff 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10">
        <Header />
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        <main>
          {activeTab === "analyze" ? <AnalyzeTab /> : <GenerateTab />}
        </main>

        <footer className="text-center py-8 text-gray-700 text-xs">
          <p>PromptForge ⚡ — Built with React + Node.js + OpenAI GPT-4o-mini</p>
          <p className="mt-1">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded border border-white/10 text-gray-600 font-mono">
              Ctrl+Enter
            </kbd>{" "}
            to submit
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;