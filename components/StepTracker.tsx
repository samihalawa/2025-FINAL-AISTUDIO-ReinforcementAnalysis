import React from 'react';
import { Phase, PhaseStatus } from '../types';
import { CheckCircleIcon, SpinnerIcon, XCircleIcon } from './icons';

const getPhaseStatusIcon = (status: PhaseStatus) => {
    const sizeClass = 'w-full h-full';
    switch (status) {
        case PhaseStatus.Completed:
            return <CheckCircleIcon className={`${sizeClass} text-green-500`} />;
        case PhaseStatus.Running:
            return <SpinnerIcon className={`${sizeClass} text-indigo-500`} />;
        case PhaseStatus.Failed:
            return <XCircleIcon className={`${sizeClass} text-red-500`} />;
        case PhaseStatus.Pending:
        default:
            return <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>;
    }
}

const PhaseItem: React.FC<{
  phase: Phase;
  index: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ phase, index, isActive, onClick }) => {
    const isClickable = phase.status === PhaseStatus.Completed || phase.status === PhaseStatus.Failed;
    const displayName = phase.name.substring(phase.name.indexOf(':') + 1).trim();

    return (
        <li className="relative flex-1 flex flex-col items-center gap-2 text-center group z-10">
           <div className={`absolute -bottom-2 transition-all duration-300 w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_12px_4px] shadow-indigo-500/80 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
            <button
                onClick={isClickable ? onClick : undefined}
                disabled={!isClickable}
                className={`relative h-12 w-12 flex items-center justify-center rounded-full transition-all duration-300 ${isActive ? 'animate-pulse-glow bg-indigo-500/20' : 'bg-white/40 group-hover:bg-indigo-500/10'} ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                aria-current={isActive ? 'step' : undefined}
            >
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/5 group-hover:ring-black/10"></div>
                <div className={`text-lg font-bold transition-colors duration-300 ${phase.status === PhaseStatus.Pending ? 'text-zinc-500' : 'text-text-primary'}`}>
                    {index + 1}
                </div>
                 <div className="absolute -bottom-1 -right-1 bg-white rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-gray-200">
                    {getPhaseStatusIcon(phase.status)}
                </div>
            </button>
             <h4 className={`font-medium text-xs leading-tight max-w-[120px] transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-text-secondary group-hover:text-text-primary'}`}>
                {displayName}
            </h4>
        </li>
    );
}

export const PhaseTracker: React.FC<{
    phases: Phase[];
    onPhaseSelect: (phaseId: string | null) => void;
    activePhaseId: string | null;
}> = ({ phases, onPhaseSelect, activePhaseId }) => {
    const completedPhasesCount = phases.filter(p => p.status === PhaseStatus.Completed).length;
    const progressPercentage = (completedPhasesCount / (phases.length || 1)) * 100;
  
    return (
    <nav aria-label="Analysis Pipeline" className="w-full">
      <div className="relative w-full">
         <div className="absolute top-[24px] left-0 right-0 h-0.5 bg-gray-200 w-full">
             <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-500" style={{
                 width: `${progressPercentage}%`,
                 transition: 'width 0.5s ease-in-out'
                }}></div>
         </div>
         <ul className="flex items-start justify-between gap-2">
            {phases.map((phase, index) => (
              <PhaseItem
                key={phase.id} 
                phase={phase}
                index={index}
                isActive={phase.id === activePhaseId}
                onClick={() => onPhaseSelect(phase.id === activePhaseId ? null : phase.id)}
              />
            ))}
          </ul>
      </div>
    </nav>
  );
};
