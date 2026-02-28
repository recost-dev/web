import { useState, useEffect, useCallback } from "react";
import { HashRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LandingPage } from "./components/LandingPage";
import { ScanningPage } from "./components/ScanningPage";
import { ResultsPage } from "./components/ResultsPage";
import { postMessage } from "./vscode";
import { Layout } from "./dashboard/layout/Layout";
import { ThemeProvider } from "./dashboard/theme-context";
import { galaxySunsetTheme } from "./dashboard/themes";
import Dashboard from "./dashboard/pages/Dashboard";
import Endpoints from "./dashboard/pages/Endpoints";
import Suggestions from "./dashboard/pages/Suggestions";
import Graph from "./dashboard/pages/Graph";
import AiChat from "./dashboard/pages/AiChat";
import Projects from "./dashboard/pages/Projects";
import type { Suggestion as SuggestionType, ScanSummary, EndpointRecord, HostMessage } from "./types";

const queryClient = new QueryClient();

type Screen = "landing" | "scanning" | "results";

function ScanApp() {
  const [screen, setScreen] = useState<Screen>("landing");

  // Scanning state
  const [scanFiles, setScanFiles] = useState<string[]>([]);
  const [scanIndex, setScanIndex] = useState(0);
  const [scanTotal, setScanTotal] = useState(0);
  const [endpointCount, setEndpointCount] = useState(0);

  // Results state
  const [endpoints, setEndpoints] = useState<EndpointRecord[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [summary, setSummary] = useState<ScanSummary>({
    totalEndpoints: 0,
    totalCallsPerDay: 0,
    totalMonthlyCost: 0,
    highRiskCount: 0,
  });

  const handleStartScan = useCallback(() => {
    setScanFiles([]);
    setScanIndex(0);
    setScanTotal(0);
    setEndpointCount(0);
    setScreen("scanning");
    postMessage({ type: "startScan" });
  }, []);

  const handleRescan = useCallback(() => {
    handleStartScan();
  }, [handleStartScan]);

  // Listen for host messages
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data as HostMessage;

      switch (msg.type) {
        case "scanProgress":
          setScanFiles((prev) => {
            if (!prev.includes(msg.file)) {
              return [...prev, msg.file];
            }
            return prev;
          });
          setScanIndex(msg.index);
          setScanTotal(msg.total);
          setEndpointCount(msg.endpointsSoFar);
          break;

        case "triggerScan":
          handleStartScan();
          break;

        case "scanComplete":
          break;

        case "scanResults":
          setEndpoints(msg.endpoints);
          setSuggestions(msg.suggestions);
          setSummary(msg.summary);
          setTimeout(() => setScreen("results"), 300);
          break;

        case "error":
          if (screen === "scanning") {
            setScreen("landing");
          }
          break;
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [screen]);

  void handleRescan;

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {screen === "landing" && <LandingPage onStartScan={handleStartScan} />}
      {screen === "scanning" && (
        <ScanningPage
          files={scanFiles}
          currentIndex={scanIndex}
          endpointCount={endpointCount}
          total={scanTotal}
        />
      )}
      {screen === "results" && (
        <ResultsPage
          endpoints={endpoints}
          suggestions={suggestions}
          summary={summary}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ScanApp />} />
          <Route
            path="/projects"
            element={
              <ThemeProvider theme={galaxySunsetTheme}>
                <Projects />
              </ThemeProvider>
            }
          />
          <Route path="/projects/:projectId" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="endpoints" element={<Endpoints />} />
            <Route path="suggestions" element={<Suggestions />} />
            <Route path="graph" element={<Graph />} />
            <Route path="chat" element={<AiChat />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}
