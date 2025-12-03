import React from 'react';

export const AppLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#4f46e5" />
            </linearGradient>
        </defs>
        <path d="M16 3L3 9.75V22.25L16 29L29 22.25V9.75L16 3Z" stroke="url(#logo-gradient)" strokeWidth="3" opacity="0.3"/>
        <path d="M16 3L3 9.75V22.25L16 29L29 22.25V9.75L16 3Z" stroke="url(#logo-gradient)" strokeWidth="1.5"/>
        <path d="M16 17.5V29L29 22.25V9.75L16 17.5Z" fill="#4f46e5" fillOpacity="0.1" stroke="url(#logo-gradient)" strokeWidth="1.5"/>
        <path d="M16 17.5L3 9.75L16 3L29 9.75L16 17.5Z" fill="#38bdf8" fillOpacity="0.2" stroke="url(#logo-gradient)" strokeWidth="1.5"/>
    </svg>
);

export const CheckCircleIcon = ({className = "h-6 w-6 text-green-500"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const XCircleIcon = ({className = "h-6 w-6 text-red-500"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const SpinnerIcon = ({className = "h-6 w-6 text-indigo-500"}) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

// FIX: Add FileIcon component for use in FileUpload.
export const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

// FIX: Add CheckIcon component for use in FormattedContent.
export const CheckIcon = ({ className = "h-5 w-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const XMarkIcon = ({ className = "h-4 w-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const SparklesIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.4-1.4l-1.188-.648 1.188-.648a2.25 2.25 0 011.4-1.4l.648-1.188.648 1.188a2.25 2.25 0 011.4 1.4l1.188.648-1.188.648a2.25 2.25 0 01-1.4 1.4z" />
    </svg>
);

export const AnalysisIcon = ({ className = "w-16 h-16" }) => (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 59C46.9117 59 59 46.9117 59 32C59 17.0883 46.9117 5 32 5C17.0883 5 5 17.0883 5 32C5 46.9117 17.0883 59 32 59Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 22L42 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4"/>
        <path d="M22 32H32V42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M42 22H32V32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const GeminiLogo = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1.5 align-text-bottom">
        <path d="M4.54545 12C4.54545 16.1066 7.89341 19.4545 12 19.4545C16.1066 19.4545 19.4545 16.1066 19.4545 12C19.4545 7.89341 16.1066 4.54545 12 4.54545C7.89341 4.54545 4.54545 7.89341 4.54545 12ZM12 17.5758C15.0805 17.5758 17.5758 15.0805 17.5758 12C17.5758 8.91954 15.0805 6.42424 12 6.42424C8.91954 6.42424 6.42424 8.91954 6.42424 12C6.42424 15.0805 8.91954 17.5758 12 17.5758Z" fill="url(#paint0_linear_1_2)"/>
        <path d="M12 2.6665C10.7456 2.6665 9.54471 3.15341 8.66529 4.03283L10.0806 5.44814C10.6433 4.88548 11.3006 4.54529 12 4.54529C14.1667 4.54529 15.962 4.98165 17.3987 5.82672L15.9221 7.3033C14.9431 6.71361 13.5292 6.42407 12 6.42407C10.4708 6.42407 9.0569 6.71361 8.07788 7.3033L6.60127 5.82672C7.75545 5.10915 9.08333 4.54529 10.5 4.14818V2.78771C10.9708 2.71216 11.4708 2.6665 12 2.6665Z" fill="url(#paint1_linear_1_2)"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="12" y1="4.54545" x2="12" y2="19.4545" gradientUnits="userSpaceOnUse">
                <stop stopColor="#99E1FF"/>
                <stop offset="1" stopColor="#A582F7"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="12.0113" y1="2.6665" x2="12.0113" y2="7.3033" gradientUnits="userSpaceOnUse">
                <stop stopColor="#99E1FF"/>
                <stop offset="1" stopColor="#A582F7"/>
            </linearGradient>
        </defs>
    </svg>
);
