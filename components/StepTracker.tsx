import React from 'react';
import { Phase, PhaseStatus } from '../types';
import { CheckIcon, SpinnerIcon } from './icons';

const PhaseItem: React.FC<{
  phase: Phase;
  index: number;
  isActive: boolean;
  onClick: () => void;
  total: number;
}> = ({ phase, index, isActive, onClick, total }) => {
    const isClickable = phase.status === PhaseStatus.Completed || phase.status === PhaseStatus.Failed;
    const isCompleted = phase.status === PhaseStatus.Completed;
    const isRunning = phase.status === PhaseStatus.Running;
    
    // Extract a cleaner name
    const displayName = phase.name.includes(':') 
        ? phase.name.substring(phase.name.indexOf(':') + 1).trim() 
        : phase.name;

    return (
        <li className="relative flex-1 flex flex-col items-center gap-3 text-center group z-10">
            {/* Connector Line */}
            {index < total - 1 && (
                <div className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 ${isCompleted ? 'bg-sky-200' : 'bg-slate-100'}`}></div>
            )}
            
            <button
                onClick={isClickable ? onClick : undefined}
                disabled={!isClickable}
                className={`relative h-8 w-8 flex items-center justify-center rounded-full transition-all duration-300 border-2 
                    ${isActive 
                        ? 'border-sky-500 bg-white ring-2 ring-sky-100' 
                        : isCompleted 
                            ? 'border-sky-400 bg-sky-400 text-white' 
                            : isRunning
                                ? 'border-sky-200 bg-white'
                                : 'border-slate-200 bg-white text-slate-300'
                    }
                    ${isClickable ? 'cursor-pointer hover:border-sky-400' : 'cursor-default'}
                `}
                aria-current={isActive ? 'step' : undefined}
            >
                {isCompleted ? (
                    <CheckIcon className="w-4 h-4" />
                ) : isRunning ? (
                    <SpinnerIcon className="w-4 h-4 text-sky-500" />
                ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                )}
            </button>
            
            <div className={`flex flex-col items-center transition-all duration-300 ${isActive ? 'opacity-100 transform translate-y-0' : 'opacity-70 group-hover:opacity-100'}`}>
                <h4 className={`text-[10px] uppercase tracking-wider font-bold mb-0.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`}>
                    Phase {index + 1}
                </h4>
                <p className={`text-xs font-medium leading-tight max-w-[100px] ${isActive ? 'text-slate-700' : 'text-slate-500'}`}>
                    {displayName}
                </p>
            </div>
        </li>
    );
}

export const PhaseTracker: React.FC<{
    phases: Phase[];
    onPhaseSelect: (phaseId: string | null) => void;
    activePhaseId: string | null;
}> = ({ phases, onPhaseSelect, activePhaseId }) => {
    return (
    <nav aria-label="Analysis Pipeline" className="w-full py-2">
         <ul className="flex items-start justify-between">
            {phases.map((phase, index) => (
              <PhaseItem
                key={phase.id} 
                phase={phase}
                index={index}
                total={phases.length}
                isActive={phase.id === activePhaseId}
                onClick={() => onPhaseSelect(phase.id === activePhaseId ? null : phase.id)}
              />
            ))}
          </ul>
    </nav>
  );
};