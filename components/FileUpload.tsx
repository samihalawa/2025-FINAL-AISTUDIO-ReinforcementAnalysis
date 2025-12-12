import React, { useState } from 'react';
import { UploadedFile } from '../types';
import { FileIcon } from './icons';

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ files, onFilesChange, onFileRemove, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesChange(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesChange(Array.from(event.target.files));
    }
  };

  return (
    <div className="w-full">
      <label 
        htmlFor="file-upload" 
        className={`relative cursor-pointer bg-slate-50/50 rounded-xl flex flex-col items-center justify-center p-6 group transition-all duration-300 border border-dashed ${isLoading ? 'opacity-60 cursor-not-allowed border-slate-200' : ''} ${isDragging ? 'border-sky-400 bg-sky-50/30' : 'border-slate-300 hover:border-sky-300 hover:bg-slate-50'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mb-2 transition-colors ${isDragging ? 'text-sky-500' : 'text-slate-300 group-hover:text-sky-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm font-medium text-text-secondary">
                <span className="text-sky-500 underline decoration-sky-200 hover:decoration-sky-400 underline-offset-2">Upload files</span> or drag here
            </span>
            <span className="mt-1 text-[10px] text-text-tertiary uppercase tracking-wide">TXT or JSONL</span>
        </div>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} disabled={isLoading} accept=".txt,.jsonl,text/plain,application/jsonl" />
      </label>

      {files.length > 0 && (
        <div className="mt-3">
          <ul className="space-y-2">
            {files.map((uploadedFile) => (
              <li key={uploadedFile.id} className="flex items-center justify-between bg-white p-2 pl-3 rounded-lg border border-slate-100 shadow-sm text-sm text-text-primary group">
                <div className="flex items-center overflow-hidden">
                    <FileIcon />
                    <span className="truncate ml-2 text-slate-600 font-medium">{uploadedFile.file.name}</span>
                </div>
                <button
                  onClick={() => onFileRemove(uploadedFile.id)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-50 transition-colors"
                  disabled={isLoading}
                  aria-label={`Remove ${uploadedFile.file.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};