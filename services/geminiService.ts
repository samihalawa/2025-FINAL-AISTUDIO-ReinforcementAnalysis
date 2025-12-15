import { GoogleGenAI } from "@google/genai";
import { Phase, PhaseStatus } from "../types";

const SYSTEM_PROMPT = `
**YOUR ROLE**: World-Class Multi-Phase Reasoning Engine (Powered by Gemini 3).

**CORE TASK**: Deconstruct the user's query (and any provided file context) into a comprehensive analysis report.

**REQUIREMENTS**:
1.  **Strict Structure**: You MUST output exactly 3 to 7 distinct analysis phases.
2.  **Format**: 
    *   Every phase MUST start with a Markdown Header 2 like: \`## Phase 1: [Phase Name]\`.
    *   Do NOT use H1 headers.
    *   Do NOT include a preamble or introduction before Phase 1.
    *   Do NOT include a summary after the final phase (include it IN the final phase).
3.  **Content**: 
    *   Be extremely specific to the user's input.
    *   Use Markdown tables to compare options or list constraints.
    *   Use code blocks for technical strategy.

**PHASE EXAMPLES**:
- Phase 1: Intent Recognition & Context Analysis
- Phase 2: Strategic Decomposition
- Phase 3: Risk Assessment
- Phase 4: Implementation Strategy
- Phase 5: Code / Architectural Validation
- Phase 6: Final Recommendations
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

        if (files.length > 0) {
            files.forEach(file => {
                parts.push({
                    text: `[BEGIN CONTEXT FILE: ${file.name}]\n${file.content}\n[END CONTEXT FILE]\n`
                });
            });
            parts.push({
                text: "Based on the context provided above and the request below, perform the analysis."
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
            }
        });

        const markdownContent = response.text;
        const generatedPhases: Phase[] = [];
        
        // Split by the ## Phase Header pattern
        const sections = markdownContent.split(/^##\s+/m);
        
        // Filter empty sections that might result from the split (e.g. text before first header)
        const validSections = sections.filter(s => s.trim().length > 0);

        validSections.forEach((sectionContent, index) => {
            const firstLineEnd = sectionContent.indexOf('\n');
            let name = "";
            let content = "";
            
            if (firstLineEnd === -1) {
                name = sectionContent.trim();
                content = "";
            } else {
                name = sectionContent.substring(0, firstLineEnd).trim();
                content = sectionContent.substring(firstLineEnd + 1).trim();
            }

            // Heuristic: If the first section doesn't start with "Phase", it might be a preamble.
            // But since the loop index drives the phase ID, we just clean up the name.
            // If the name is "Phase 1: Foo", replace leaves "Foo".
            // If the name is "Foo", replace leaves "Foo".
            const cleanName = name.replace(/^(Phase\s+\d+:?\s*)/i, '').trim(); 
            
            // If the section content is extremely short and looks like garbage, skip it?
            // For now, we trust the model mostly adhered to the prompt.

            generatedPhases.push({
                id: `phase${generatedPhases.length + 1}`,
                name: `Phase ${generatedPhases.length + 1}: ${cleanName}`,
                status: PhaseStatus.Completed,
                content: content,
                error: null,
            });
        });

        if (generatedPhases.length === 0) {
             // Fallback: If parsing completely fails, treat entire text as one phase
            return [{
                id: 'phase1',
                name: 'Phase 1: Analysis Result',
                status: PhaseStatus.Completed,
                content: markdownContent,
                error: null,
            }];
        }

        return generatedPhases;

    } catch (e) {
        console.error("Error running reinforcement analysis:", e);
        throw e;
    }
}