import { GoogleGenAI } from "@google/genai";
import { Phase, PhaseStatus } from "../types";

const SYSTEM_PROMPT = `
**YOUR ROLE**: World-Class Multi-Phase Reasoning Engine (Powered by Gemini 3).

**CORE TASK**: Deconstruct the user's query (and any provided file context) into a series of logical analysis phases. Execute these phases to produce a comprehensive, insightful, and actionable report. You are not a chatbot; you are a structured analysis generator.

**REASONING PROCESS**:
1.  **Deconstruct**: Analyze the user's goal, constraints, and any attached context files. Understand the type of output needed.
2.  **Plan**: Create a unique, multi-step reasoning plan. Define a set of 3 to 7 logical "phases" for your analysis. Each phase must have a clear, descriptive name.
    *   *Example*: "Context Analysis," "Strategy Formulation," "Risk Assessment," "Final Recommendations."
3.  **Execute**: Perform the analysis for each phase. Use your advanced reasoning capabilities to provide deep, specific insights. Use tables, lists, and code blocks where appropriate.
4.  **Report**: Combine outputs into a single, structured Markdown document.

**OUTPUT FORMAT**:
*   You MUST structure your entire response as a single Markdown document.
*   Each phase of your analysis MUST start with a Markdown H2 header (e.g., \`## Phase 1: Safety & Brand-Risk Filtering\`).
*   The phase numbering must be sequential.
*   Do not include any preamble, conversational text, or summaries outside of this structured phase-based format. Your output begins directly with the first phase header.
`;

export const getInitialPhases = (): Phase[] => [];

export interface FileContent {
    name: string;
    content: string;
}

export async function runReinforcementAnalysis(
    userInput: string,
    files: FileContent[] = []
): Promise<Phase[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const parts = [];

        // Add file context if available, leveraging Gemini 3's large context window
        if (files.length > 0) {
            files.forEach(file => {
                parts.push({
                    text: `[BEGIN CONTEXT FILE: ${file.name}]\n${file.content}\n[END CONTEXT FILE]\n`
                });
            });
            parts.push({
                text: "Based on the context provided above (if any) and the following request, perform the multi-phase analysis."
            });
        }

        parts.push({ text: `Analyze the following request: "${userInput}"` });

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                role: 'user',
                parts: parts
            },
            config: {
                systemInstruction: SYSTEM_PROMPT,
                // Gemini 3 defaults to 'high' thinking level and 1.0 temperature, 
                // which is optimal for this reasoning task.
            }
        });

        const markdownContent = response.text;
        const generatedPhases: Phase[] = [];
        const sections = markdownContent.split(/^##\s+/m).filter(s => s.trim() !== '');

        if (sections.length === 0) {
            // Fallback for when the AI doesn't follow the format
            return [{
                id: 'phase1',
                name: 'Analysis Result',
                status: PhaseStatus.Completed,
                content: markdownContent,
                error: null,
            }];
        }

        sections.forEach((sectionContent, index) => {
            const firstLineEnd = sectionContent.indexOf('\n');
            const name = sectionContent.substring(0, firstLineEnd).trim();
            const content = sectionContent.substring(firstLineEnd + 1).trim();
            
            generatedPhases.push({
                id: `phase${index + 1}`,
                name: name,
                status: PhaseStatus.Completed,
                content: content,
                error: null,
            });
        });

        return generatedPhases;

    } catch (e) {
        console.error("Error running reinforcement analysis:", e);
        throw e;
    }
}