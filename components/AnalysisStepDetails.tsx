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
        }, 300); // Animation duration
        return () => clearTimeout(timer);
    } else if (!phase && visiblePhase) {
        setVisiblePhase(null);
    }
  }, [phase, visiblePhase]);
  
  if (!analysisHasRun) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <AnalysisIcon className="w-12 h-12 text-zinc-400 mb-4" />
        <h3 className="text-lg font-semibold text-text-primary">Reinforcement Analysis AI</h3>
        <p className="mt-1 text-sm text-text-secondary max-w-sm">
          Enter any query, problem, or idea. The AI will apply a dynamic, multi-phase reasoning process to provide a detailed, actionable analysis.
        </p>
      </div>
    );
  }

  if (!visiblePhase) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in-up">
        <SparklesIcon className="w-12 h-12 text-indigo-400 mb-4" />
        <h3 className="text-lg font-semibold text-text-primary">Analysis Complete</h3>
        <p className="mt-1 text-sm text-text-secondary max-w-sm">
          Select a phase from the tracker below to view its detailed results.
        </p>
      </div>
    );
  }
  
  const contentToDisplay = visiblePhase.content || '';

  return (
    <div className={`h-full flex flex-col transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xl font-bold text-text-primary">{visiblePhase.name}</h3>

            <div className="mt-6 flex-1 overflow-y-auto pr-2">
              <FormattedContent content={contentToDisplay} />
            </div>

            {visiblePhase.error && (
                <div className="mt-4 bg-red-100 border border-red-200 text-red-700 p-4 rounded-md">
                    <p className="font-semibold">An error occurred:</p>
                    <p className="text-sm mt-1 font-mono">{visiblePhase.error}</p>
                </div>
            )}
        </div>
    </div>
  );
};
