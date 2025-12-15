import React, { useState, useEffect, useMemo } from 'react';
import { CheckIcon } from './icons';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center justify-center p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-200 hover:text-white transition-all duration-200"
            aria-label="Copy code to clipboard"
        >
            {copied ? 
                <CheckIcon /> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            }
        </button>
    );
};

interface FormattedContentProps {
  content: string;
}

export const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
    const renderableContent = useMemo(() => {
        if (!content) return [];
        
        const textColors = { 
            p: 'text-text-secondary', 
            strong: 'text-text-primary', 
            blockquote: 'text-zinc-600', 
            code: 'text-indigo-600' 
        };

        const processLine = (line: string): string => {
            return line
                .replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/\[(\d+)\]/g, `<sup class="font-mono text-[0.7em] top-[-0.5em] bg-gray-200 text-gray-600 rounded px-1 py-0.5 ml-0.5">$1</sup>`)
                .replace(/\*\*(.*?)\*\*/g, `<strong class="font-semibold ${textColors.strong}">$1</strong>`)
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, `<code class="bg-black/5 text-indigo-600 rounded px-1.5 py-0.5 text-[0.9em] font-mono mx-0.5">$1</code>`);
        };
        
        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];
        let buffer: string[] = [];
        let bufferType: 'p' | 'ul' | 'ol' | 'code' | 'blockquote' | 'table' | null = null;
        
        const flushBuffer = () => {
            if (buffer.length === 0) return;

            const key = `el-${elements.length}`;

            switch (bufferType) {
                case 'p':
                    elements.push(<p key={key} className={`${textColors.p} my-4 leading-relaxed`} dangerouslySetInnerHTML={{ __html: buffer.join(' ') }} />);
                    break;
                case 'ul':
                    elements.push(<ul key={key} className="list-disc list-outside pl-5 space-y-2 my-4 text-text-secondary">{buffer.map((item, i) => <li key={`${key}-${i}`} dangerouslySetInnerHTML={{__html: item}} />)}</ul>);
                    break;
                case 'ol':
                    elements.push(<ol key={key} className="list-decimal list-outside pl-5 space-y-2 my-4 text-text-secondary">{buffer.map((item, i) => <li key={`${key}-${i}`} dangerouslySetInnerHTML={{__html: item}} />)}</ol>);
                    break;
                case 'blockquote':
                    elements.push(<blockquote key={key} className={`border-l-4 border-gray-300 pl-4 my-4 italic ${textColors.blockquote}`}>{buffer.map((item, i) => <p key={`${key}-${i}`} dangerouslySetInnerHTML={{__html: item}} />)}</blockquote>);
                    break;
                case 'code':
                    const codeBlockContent = buffer.join('\n');
                    elements.push(
                        <div key={key} className="relative group my-4">
                            <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-transparent overflow-x-auto text-sm shadow-sm">
                               <code className="font-mono">{codeBlockContent}</code>
                            </pre>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                                <CopyButton text={codeBlockContent} />
                            </div>
                        </div>
                    );
                    break;
                case 'table':
                    // Parse table rows
                     const tableRows = buffer.map(row => 
                        row.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim())
                    );
                    
                    // We expect at least header and separator
                    if (tableRows.length >= 2) {
                        const header = tableRows[0];
                        // The second row is usually separator "---", ignore it for display
                        const body = tableRows.slice(2);
                        
                         elements.push(
                            <div key={key} className="my-6 w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-slate-600">
                                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                {header.map((h, i) => <th key={i} className="px-6 py-3 font-semibold">{processLine(h).replace(/<[^>]*>/g, '')}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {body.map((row, i) => (
                                                <tr key={i} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                                                    {row.map((cell, j) => <td key={j} className="px-6 py-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: processLine(cell)}} />)}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    }
                    break;
            }
            buffer = [];
            bufferType = null;
        };

        for (const line of lines) {
            const trimLine = line.trim();

             // Code Block
            if (trimLine.startsWith('```')) {
                flushBuffer();
                bufferType = bufferType === 'code' ? null : 'code';
                continue;
            }
            if (bufferType === 'code') {
                buffer.push(line);
                continue;
            }
            
            // Table
            if (trimLine.startsWith('|')) {
                if (bufferType !== 'table') { flushBuffer(); bufferType = 'table'; }
                buffer.push(trimLine);
                continue;
            }

            // Headers
            if (trimLine.startsWith('#')) {
                flushBuffer();
                const level = line.indexOf(' ');
                const text = line.substring(level + 1).trim();
                const key = `el-${elements.length}`;
                if (level === 1) elements.push(<h1 key={key} className={`text-2xl font-bold mt-8 mb-4 ${textColors.strong}`} dangerouslySetInnerHTML={{__html: processLine(text)}} />);
                else if (level === 2) elements.push(<h2 key={key} className={`text-xl font-bold mt-6 mb-3 border-b pb-2 border-slate-100 ${textColors.strong}`} dangerouslySetInnerHTML={{__html: processLine(text)}} />);
                else elements.push(<h3 key={key} className={`text-lg font-bold mt-5 mb-2 ${textColors.strong}`} dangerouslySetInnerHTML={{__html: processLine(text)}} />);
                continue;
            }
            
            // List Items
            const ulMatch = line.match(/^\s*[-*]\s+(.*)/);
            if (ulMatch) {
                if (bufferType !== 'ul') { flushBuffer(); bufferType = 'ul'; }
                buffer.push(processLine(ulMatch[1]));
                continue;
            }
            const olMatch = line.match(/^\s*\d+\.\s+(.*)/);
            if (olMatch) {
                if (bufferType !== 'ol') { flushBuffer(); bufferType = 'ol'; }
                buffer.push(processLine(olMatch[1]));
                continue;
            }
            
            // Blockquotes
            const bqMatch = line.match(/^\s*>\s+(.*)/);
            if (bqMatch) {
                if (bufferType !== 'blockquote') { flushBuffer(); bufferType = 'blockquote'; }
                buffer.push(processLine(bqMatch[1]));
                continue;
            }
            
            // Paragraphs
            if (trimLine === '') {
                flushBuffer();
            } else {
                if (bufferType !== 'p') { flushBuffer(); bufferType = 'p'; }
                buffer.push(processLine(line));
            }
        }
        flushBuffer();

        return elements;
    }, [content]);

    return <div>{renderableContent}</div>;
};