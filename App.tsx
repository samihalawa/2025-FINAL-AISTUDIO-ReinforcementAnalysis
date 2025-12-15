import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  
  // Ref for the textarea to manage focus
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Track if we have results
  const analysisHasRun = useMemo(() => phases.length > 0 && phases[0].status !== PhaseStatus.Pending, [phases]);
  
  const startNewAnalysis = () => {
    setUserInput('');
    setFiles([]);
    setPhases(getInitialPhases());
    setIsLoading(false);
    setSelectedPhaseId(null);
    setError(null);
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
  
  const handleQuickPrompt = (prompt: string) => {
    setUserInput(prompt);
    // Focus the textarea and set cursor to end for better UX
    setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.selectionStart = prompt.length;
            textareaRef.current.selectionEnd = prompt.length;
        }
    }, 0);
  };

  const handleStartAnalysis = async () => {
    if (userInput.trim() === '' && files.length === 0) {
      setError("Please enter a query or upload a file.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSelectedPhaseId(null);
    setPhases([]); 

    try {
      // 1. Prepare File Content
      const fileContents: FileContent[] = await Promise.all(
        files.map(async (f) => ({
          name: f.file.name,
          content: await f.file.text()
        }))
      );

      // 2. FETCH REAL DATA (The "Thinking" State)
      // We await the full response first to ensure validity, then animate the reveal.
      const realPhases = await runReinforcementAnalysis(userInput, fileContents);

      // 3. Initialize Phases in "Pending" state for the visual timeline
      const displayPhases = realPhases.map(p => ({
        ...p,
        status: PhaseStatus.Pending,
        content: null // Hide content initially
      }));
      setPhases(displayPhases);

      // 4. Progressive Reveal Animation
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

      for (let i = 0; i < realPhases.length; i++) {
        // A. Mark current phase as RUNNING
        setPhases(prev => prev.map((p, idx) => 
            idx === i ? { ...p, status: PhaseStatus.Running } : p
        ));
        
        // Auto-focus the active phase in the tracker
        setSelectedPhaseId(realPhases[i].id);

        // B. Simulate "Processing" time per phase (shorter for real data since we have it)
        // We vary it slightly to make it feel organic.
        await delay(800 + Math.random() * 500);

        // C. Mark as COMPLETED and reveal REAL content
        setPhases(prev => prev.map((p, idx) => 
            idx === i ? { 
                ...p, 
                status: PhaseStatus.Completed, 
                content: realPhases[i].content 
            } : p
        ));
      }

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during analysis.";
      if (errorMessage.includes('API key')) {
         setError("Invalid API Key. Please check your settings.");
      } else {
         setError(errorMessage);
      }
      // If failed, clear phases so user can try again
      setPhases([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const activePhase = useMemo(() => {
    if (selectedPhaseId) return phases.find(p => p.id === selectedPhaseId);
    return null;
  }, [phases, selectedPhaseId]);

  return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden bg-slate-50/50">
      <div className="w-full h-full max-w-[1600px] flex flex-col overflow-hidden relative">

        <header className="flex items-center justify-between h-20 px-4 lg:px-8 shrink-0 z-20 select-none">
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

        <main className="flex-1 flex flex-col lg:grid lg:grid-cols-[400px_1fr] overflow-y-auto lg:overflow-hidden z-10 px-4 lg:px-8 pb-8 gap-6 lg:gap-8">
            <aside className="clean-panel w-full lg:h-full overflow-hidden flex flex-col bg-white shrink-0 min-h-[500px] lg:min-h-0">
                <div className="flex flex-col h-full p-6 lg:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <div>
                      <h2 className="text-xl font-medium text-text-primary mb-1">New Analysis</h2>
                      <p className="text-sm text-text-tertiary">Input your query context below.</p>
                    </div>

                    <textarea
                        ref={textareaRef}
                        rows={6}
                        name="user-input"
                        id="user-input"
                        className="block w-full rounded-xl border-0 py-4 px-4 text-text-primary shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-text-tertiary focus:ring-2 focus:ring-inset focus:ring-sky-200 sm:text-sm sm:leading-6 disabled:opacity-60 disabled:cursor-not-allowed transition-all bg-slate-50 hover:bg-white resize-y min-h-[120px]"
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
                    
                     <div className="pt-2">
                      <button
                          type="button"
                          onClick={handleStartAnalysis}
                          disabled={(userInput.trim() === '' && files.length === 0) || isLoading}
                          className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white font-medium py-3 px-6 rounded-full shadow-md shadow-sky-200 hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-[0.98]"
                      >
                          {isLoading ? (
                              <>
                                  <SpinnerIcon className="h-5 w-5 text-white"/>
                                  <span className="ml-2">Analyzing Workflow...</span>
                              </>
                          ) : (
                             <>
                              <SparklesIcon className="w-5 h-5" />
                              <span className="text-base">Start Analysis</span>
                             </>
                          )}
                      </button>
                      {error && !isLoading && <p className="mt-3 text-sm text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}
                     </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3">Quick Prompts</h3>
                      <div className="flex flex-wrap gap-2">
                        {EXAMPLE_PROMPTS.map(prompt => (
                          <button 
                            key={prompt}
                            type="button"
                            onClick={() => handleQuickPrompt(prompt)}
                            disabled={isLoading}
                            className="px-3 py-1.5 bg-white text-xs font-medium text-text-secondary rounded-full hover:bg-sky-50 hover:text-sky-600 transition-colors border border-slate-200 disabled:opacity-50 text-left active:bg-sky-100"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                     <div className="mt-auto space-y-3 pt-4">
                      {analysisHasRun && !isLoading && (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                              type="button"
                              onClick={startNewAnalysis}
                              disabled={isLoading}
                              className="w-full flex items-center justify-center gap-2 text-sm bg-white text-slate-600 border border-slate-200 font-medium hover:bg-slate-50 transition-colors py-2.5 rounded-full"
                          >
                              <XMarkIcon className="w-4 h-4" /> Reset
                          </button>
                          <button
                              type="button"
                              onClick={handleDownloadReport}
                              disabled={isLoading}
                              className="w-full flex items-center justify-center gap-2 text-sm bg-white text-slate-600 border border-slate-200 font-medium hover:bg-slate-50 transition-colors py-2.5 rounded-full disabled:opacity-50"
                          >
                              <DownloadIcon /> Export
                          </button>
                        </div>
                      )}
                  </div>
                </div>
            </aside>

            <section className="flex flex-col gap-6 overflow-hidden h-full min-h-[500px] lg:min-h-0">
               {analysisHasRun || isLoading ? (
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