import React, { useState, useCallback, useMemo } from 'react';
import { Phase, PhaseStatus, UploadedFile } from './types';
import { PhaseTracker } from './components/StepTracker';
import { getInitialPhases, runReinforcementAnalysis, FileContent } from './services/geminiService';
import { PhaseDetails } from './components/AnalysisStepDetails';
import { AppLogo, GeminiLogo, SparklesIcon, XMarkIcon, SpinnerIcon, DownloadIcon } from './components/icons';
import { generateReport } from './services/reportService';
import { FileUpload } from './components/FileUpload';

const EXAMPLE_PROMPTS = [
  "Choose the best domain from a list for a tech startup",
  "Design MCP tools for an email client",
  "How to scale my database",
  "Microservices vs monolith",
  "Validate my startup idea",
  "Grow my user base",
  "UI/UX improvement ideas",
  "Troubleshoot a system failure",
  "Resolve team conflicts",
  "Create a content strategy plan"
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
      setError("Please enter a query or upload a file to begin analysis.");
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
         setError("The API key is invalid or missing required permissions. Please check your configuration.");
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
    <div className="flex flex-col h-full p-6 space-y-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-text-primary">Your Query</h2>
        <textarea
            rows={6}
            name="user-input"
            id="user-input"
            className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text-primary shadow-sm ring-1 ring-inset ring-black/10 placeholder:text-text-tertiary focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 disabled:opacity-60 disabled:cursor-not-allowed transition-colors bg-white/50"
            placeholder="e.g., 'Analyze these logs for errors' or 'Critique my business plan'"
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
          <h3 className="text-sm font-medium text-text-secondary mb-2">Or, try an example...</h3>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map(prompt => (
              <button 
                key={prompt}
                onClick={() => setUserInput(prompt)}
                disabled={isLoading}
                className="px-3 py-1 bg-white/60 text-xs text-text-secondary rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors ring-1 ring-inset ring-black/5 disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
        
         <div className="pt-4 mt-auto space-y-4">
          {error && !isLoading && <p className="text-sm text-red-600">{error}</p>}
          <button
              onClick={handleStartAnalysis}
              disabled={(userInput.trim() === '' && files.length === 0) || isLoading}
              className="relative overflow-hidden w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-[0.98]"
          >
              {isLoading ? (
                  <>
                      <SpinnerIcon className="h-5 w-5"/>
                      Analyzing...
                  </>
              ) : (
                 <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>Run Analysis</span>
                 </>
              )}
          </button>

          {analysisHasRun && (
            <div className="flex items-center gap-2">
              <button
                  onClick={startNewAnalysis}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-1.5 text-sm bg-indigo-600/10 text-indigo-600 font-medium hover:bg-indigo-600/20 hover:text-indigo-700 transition-colors py-2 rounded-lg"
              >
                  <XMarkIcon className="w-4 h-4" /> New Analysis
              </button>
              <button
                  onClick={handleDownloadReport}
                  disabled={isLoading || appState !== 'complete'}
                  className="w-full flex items-center justify-center gap-1.5 text-sm bg-indigo-600/10 text-indigo-600 font-medium hover:bg-indigo-600/20 hover:text-indigo-700 transition-colors py-2 rounded-lg disabled:opacity-50"
              >
                  <DownloadIcon /> Download Report
              </button>
            </div>
          )}
      </div>
    </div>
  );

  return (
    <div className="p-0 sm:p-4 md:p-6 h-full w-full flex items-center justify-center overflow-hidden">
      <div className="w-full h-full sm:rounded-2xl flex flex-col overflow-hidden relative">
          <div className={`aurora aurora-idle ${appState === 'idle' ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className={`aurora aurora-loading ${appState === 'loading' ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className={`aurora aurora-complete ${appState === 'complete' ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className={`aurora aurora-error ${appState === 'error' ? 'opacity-100' : 'opacity-0'}`}></div>

        <header className="flex items-center justify-between h-16 px-6 shrink-0 z-20 select-none glass-panel !rounded-b-none !border-b-0">
            <div className="flex items-center space-x-2">
                <AppLogo />
                <h1 className="text-md font-semibold text-text-primary hidden sm:block">Reinforcement Analysis AI</h1>
            </div>
            <div className="flex items-center text-sm font-medium text-text-secondary">
                <GeminiLogo />
                <span>Powered by Gemini 3</span>
            </div>
        </header>

        <main className="flex-1 grid lg:grid-cols-[minmax(320px,420px)_1fr] overflow-hidden z-10 p-4 sm:p-6 gap-6">
            <aside className="glass-panel">
                <InputPanel />
            </aside>

            <section className="flex flex-col gap-6 overflow-hidden">
                <div className="flex-1 glass-panel overflow-hidden p-6 md:p-8">
                    <PhaseDetails 
                      phase={activePhase}
                      analysisHasRun={analysisHasRun}
                    />
                </div>
                {analysisHasRun && (
                  <div className="shrink-0 glass-panel p-4 animate-fade-in-up">
                      <PhaseTracker phases={phases} onPhaseSelect={setSelectedPhaseId} activePhaseId={activePhase?.id || null} />
                  </div>
                )}
            </section>
        </main>
      </div>
    </div>
  );
}