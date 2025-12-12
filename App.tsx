import React, { useState, useCallback, useMemo } from 'react';
import { Phase, PhaseStatus, UploadedFile } from './types';
import { PhaseTracker } from './components/StepTracker';
import { getInitialPhases, runReinforcementAnalysis, FileContent } from './services/geminiService';
import { PhaseDetails } from './components/AnalysisStepDetails';
import { AppLogo, GeminiLogo, SparklesIcon, XMarkIcon, SpinnerIcon, DownloadIcon } from './components/icons';
import { generateReport } from './services/reportService';
import { FileUpload } from './components/FileUpload';

const EXAMPLE_PROMPTS = [
  "Agent Debugging and Deployment Audit",
  "AI Agent Forensic Analysis Report",
  "Choose the best domain for a tech startup",
  "Design MCP tools for an email client",
  "How to scale my database",
  "Microservices vs monolith",
  "Validate my startup idea",
  "Grow my user base",
  "UI/UX improvement ideas",
  "Troubleshoot a system failure"
];

export default function App() {
  const [userInput, setUserInput] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [phases, setPhases] = useState<Phase[]>(getInitialPhases());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [appState, setAppState] = useState<'idle' | 'loading' | 'error' | 'complete'>('idle');
  const analysisHasRun = useMemo(() => phases.length > 0, [phases]);
  
  const startNewAnalysis = () => {
    setUserInput('');
    setFiles([]);
    setPhases(getInitialPhases());
    setIsLoading(false);
    setSelectedPhaseId(null);
    setError(null);
    setAppState('idle');
  };

  const handleFilesChange = (newFiles: File[]) => {
    const newUploadedFiles = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file
    }));
    setFiles(prev => [...prev, ...newUploadedFiles]);
  };

  const handleFileRemove = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };
  
  const handleDownloadReport = () => {
    const reportContent = generateReport(phases);
    const blob = new Blob([reportContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reinforcement-analysis-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartAnalysis = async () => {
    if (userInput.trim() === '' && files.length === 0) {
      setError("Please enter a query or upload a file.");
      setAppState('error');
      return;
    }
    setPhases(getInitialPhases());
    setIsLoading(true);
    setSelectedPhaseId(null);
    setError(null);
    setAppState('loading');

    try {
      // Read file contents
      const fileContents: FileContent[] = await Promise.all(
        files.map(async (f) => ({
          name: f.file.name,
          content: await f.file.text()
        }))
      );

      const resultPhases = await runReinforcementAnalysis(userInput, fileContents);
      setPhases(resultPhases);
      setAppState('complete');
      if (resultPhases.length > 0) {
        setSelectedPhaseId(resultPhases[0].id);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during analysis.";
       if (errorMessage.includes('API key not valid')) {
         setError("The API key is invalid or missing required permissions.");
      } else {
         setError(errorMessage);
      }
      setPhases([]);
      setAppState('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const activePhase = useMemo(() => {
    if (selectedPhaseId) return phases.find(p => p.id === selectedPhaseId);
    return null;
  }, [phases, selectedPhaseId]);

  const InputPanel = () => (
    <div className="flex flex-col h-full p-8 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-xl font-medium text-text-primary mb-1">New Analysis</h2>
          <p className="text-sm text-text-tertiary">Input your query context below.</p>
        </div>

        <textarea
            rows={6}
            name="user-input"
            id="user-input"
            className="block w-full rounded-xl border-0 py-4 px-4 text-text-primary shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-text-tertiary focus:ring-2 focus:ring-inset focus:ring-sky-200 sm:text-sm sm:leading-6 disabled:opacity-60 disabled:cursor-not-allowed transition-all bg-slate-50 hover:bg-white resize-none"
            placeholder="Describe the task or problem you want to analyze..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
            aria-label="User query input"
        />

        <FileUpload 
          files={files}
          onFilesChange={handleFilesChange}
          onFileRemove={handleFileRemove}
          isLoading={isLoading}
        />

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3">Quick Prompts</h3>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map(prompt => (
              <button 
                key={prompt}
                onClick={() => setUserInput(prompt)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-white text-xs font-medium text-text-secondary rounded-full hover:bg-sky-50 hover:text-sky-600 transition-colors border border-slate-200 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        
         <div className="pt-2 mt-auto space-y-3">
          {error && !isLoading && <p className="text-sm text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}
          <button
              onClick={handleStartAnalysis}
              disabled={(userInput.trim() === '' && files.length === 0) || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white font-medium py-3 px-6 rounded-full shadow-sm hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 active:scale-[0.98]"
          >
              {isLoading ? (
                  <>
                      <SpinnerIcon className="h-5 w-5 text-white"/>
                      <span className="ml-2">Processing...</span>
                  </>
              ) : (
                 <>
                  <SparklesIcon className="w-4 h-4" />
                  <span>Start Reasoning</span>
                 </>
              )}
          </button>

          {analysisHasRun && (
            <div className="grid grid-cols-2 gap-3">
              <button
                  onClick={startNewAnalysis}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 text-sm bg-white text-slate-600 border border-slate-200 font-medium hover:bg-slate-50 transition-colors py-2.5 rounded-full"
              >
                  <XMarkIcon className="w-4 h-4" /> Reset
              </button>
              <button
                  onClick={handleDownloadReport}
                  disabled={isLoading || appState !== 'complete'}
                  className="w-full flex items-center justify-center gap-2 text-sm bg-white text-slate-600 border border-slate-200 font-medium hover:bg-slate-50 transition-colors py-2.5 rounded-full disabled:opacity-50"
              >
                  <DownloadIcon /> Export
              </button>
            </div>
          )}
      </div>
    </div>
  );

  return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden bg-slate-50/50">
      <div className="w-full h-full max-w-[1600px] flex flex-col overflow-hidden relative">

        <header className="flex items-center justify-between h-20 px-8 shrink-0 z-20 select-none">
            <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                  <AppLogo />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-text-primary tracking-tight">Reinforcement AI</h1>
                  <p className="text-xs text-text-tertiary">Reasoning Engine v3.0</p>
                </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200 text-xs font-medium text-text-secondary shadow-sm">
                <GeminiLogo />
                <span>Powered by Gemini 3</span>
            </div>
        </header>

        <main className="flex-1 grid lg:grid-cols-[400px_1fr] overflow-hidden z-10 px-8 pb-8 gap-8">
            <aside className="clean-panel h-full overflow-hidden">
                <InputPanel />
            </aside>

            <section className="flex flex-col gap-6 overflow-hidden h-full">
               {analysisHasRun ? (
                 <>
                  <div className="shrink-0 clean-panel p-6 bg-white flex items-center animate-fade-in-up">
                      <PhaseTracker phases={phases} onPhaseSelect={setSelectedPhaseId} activePhaseId={activePhase?.id || null} />
                  </div>
                  <div className="flex-1 clean-panel overflow-hidden p-8 md:p-10 bg-white relative">
                      <PhaseDetails 
                        phase={activePhase}
                        analysisHasRun={analysisHasRun}
                      />
                  </div>
                 </>
               ) : (
                  <div className="flex-1 clean-panel overflow-hidden p-8 md:p-10 bg-white flex items-center justify-center">
                       <PhaseDetails 
                        phase={activePhase}
                        analysisHasRun={analysisHasRun}
                      />
                  </div>
               )}
            </section>
        </main>
      </div>
    </div>
  );
}