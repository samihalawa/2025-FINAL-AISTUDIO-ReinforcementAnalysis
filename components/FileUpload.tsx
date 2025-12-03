

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
        className={`relative cursor-pointer bg-white/30 rounded-xl flex flex-col items-center justify-center p-6 group transition-all duration-200 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''} ${isDragging ? 'ring-indigo-500/70 shadow-lg shadow-indigo-500/10' : 'hover:bg-white/60'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className={`absolute inset-0 rounded-xl ring-1 ring-inset transition-all duration-200 ${isDragging ? 'ring-indigo-400/70' : 'ring-black/5 group-hover:ring-black/10'}`}></div>
        <div className="flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 transition-colors ${isDragging ? 'text-indigo-500' : 'text-zinc-500 group-hover:text-indigo-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="mt-2 text-sm font-medium text-text-secondary">
                <span className="text-indigo-500">Click to upload</span> or drag and drop
            </span>
            <span className="mt-1 text-xs text-text-tertiary">TXT or JSONL files</span>
        </div>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} disabled={isLoading} accept=".txt,.jsonl,text/plain,application/jsonl" />
      </label>

      {files.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {files.map((uploadedFile) => (
              <li key={uploadedFile.id} className="flex items-center justify-between bg-white/40 p-2 pl-3 rounded-lg text-sm text-text-primary group ring-1 ring-inset ring-black/5">
                <div className="flex items-center overflow-hidden">
                    <FileIcon />
                    <span className="truncate ml-1">{uploadedFile.file.name}</span>
                </div>
                <button
                  onClick={() => onFileRemove(uploadedFile.id)}
                  className="p-1.5 rounded-md text-zinc-500 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
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