import React, { useEffect, useState } from 'react';
import { Phase } from '../types';
import { AnalysisIcon, SparklesIcon } from './icons';
import { FormattedContent } from './FormattedContent';

interface PhaseDetailsProps {
  phase: Phase | null;
  analysisHasRun: boolean;
}

export const PhaseDetails: React.FC<PhaseDetailsProps> = ({ phase, analysisHasRun }) => {
  const [visiblePhase, setVisiblePhase] = useState(phase);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (phase && phase.id !== visiblePhase?.id) {
        setIsFading(true);
        const timer = setTimeout(() => {
            setVisiblePhase(phase);
            setIsFading(false);
        }, 200); 
        return () => clearTimeout(timer);
    } else if (!phase && visiblePhase) {
        setVisiblePhase(null);
    }
  }, [phase, visiblePhase]);
  
  if (!analysisHasRun) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
        <div className="bg-slate-50 p-6 rounded-full mb-6">
            <AnalysisIcon className="w-16 h-16 text-slate-300" />
        </div>
        <h3 className="text-2xl font-semibold text-text-primary tracking-tight">Ready to Organize & Analyze</h3>
        <p className="mt-3 text-base text-text-secondary leading-relaxed">
          Enter a complex task or problem on the left. The AI will break it down into actionable phases, helping you get things done with clarity and precision.
        </p>
      </div>
    );
  }

  if (!visiblePhase) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up max-w-md mx-auto">
        <div className="bg-sky-50 p-4 rounded-full mb-4">
             <SparklesIcon className="w-8 h-8 text-sky-500" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary">Analysis Complete</h3>
        <p className="mt-2 text-sm text-text-secondary">
          The reasoning engine has finished processing. Select a phase from the timeline above to review the detailed output.
        </p>
      </div>
    );
  }
  
  const contentToDisplay = visiblePhase.content || '';

  return (
    <div className={`h-full flex flex-col transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 text-sky-600 text-sm font-bold">
                    {visiblePhase.id.replace('phase', '')}
                </span>
                <h3 className="text-xl font-bold text-text-primary tracking-tight">{visiblePhase.name}</h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
              <FormattedContent content={contentToDisplay} />
            </div>

            {visiblePhase.error && (
                <div className="mt-6 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-sm">
                    <p className="font-semibold mb-1">Attention Needed</p>
                    <p>{visiblePhase.error}</p>
                </div>
            )}
        </div>
    </div>
  );
};