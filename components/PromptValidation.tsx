import React, { useEffect, useState } from 'react';
import { SpinnerIcon } from './icons';

interface PromptValidationProps {
    critique: string | null;
    score: number | null;
    isLoading: boolean;
}

const CircularProgress: React.FC<{ score: number }> = ({ score }) => {
    const [displayScore, setDisplayScore] = useState(0);
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;

    const scoreColor = score >= 85 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';

    useEffect(() => {
        setDisplayScore(0); // Reset on score change
        let start = 0;
        const end = score;
        if (start === end) return;

        const duration = 1000;
        const increment = end / (duration / 10);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayScore(end);
                clearInterval(timer);
            } else {
                setDisplayScore(Math.ceil(start));
            }
        }, 10);

        return () => clearInterval(timer);
    }, [score]);


    return (
        <div className="relative h-32 w-32 flex-shrink-0">
            <svg
                className="h-full w-full"
                width="120"
                height="120"
                viewBox="0 0 120 120"
            >
                <circle
                    className="text-black/10"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className={`${scoreColor} transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${scoreColor}`}>
                {displayScore}
                <span className="text-base font-medium opacity-70 mt-1">%</span>
            </div>
        </div>
    );
};


export const PromptValidation: React.FC<PromptValidationProps> = ({ critique, score, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white/50 rounded-xl p-6 flex items-center justify-center border border-black/5 min-h-[160px]">
                <SpinnerIcon className="w-6 h-6 text-indigo-500 mr-3" />
                <span className="text-text-secondary font-medium">Validating prompt...</span>
            </div>
        );
    }
    
    if (critique === null || score === null) {
        return null; // Don't render if there's no data and not loading
    }
    
    return (
        <div className="bg-white/50 rounded-xl p-6 flex flex-col sm:flex-row items-start gap-6 border border-black/5 animate-fade-in-up">
            <CircularProgress score={score} />
            <div className="flex-1">
                <h4 className="font-semibold text-text-primary">Prompt Validation & Critique</h4>
                <p className="mt-2 text-sm text-text-secondary">{critique}</p>
            </div>
        </div>
    );
};