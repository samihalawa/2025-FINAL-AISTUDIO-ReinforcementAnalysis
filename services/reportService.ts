import { Phase } from '../types';

export function generateReport(phases: Phase[]): string {
  let report = `# Reinforcement Analysis Report\n\n`;
  report += `**Generated on:** ${new Date().toUTCString()}\n\n`;
  report += `--- \n\n`;

  phases.forEach(phase => {
    if (phase.status === 'completed' && phase.content) {
      report += `## ${phase.name}\n\n`;
      report += `${phase.content}\n\n`;
      report += `--- \n\n`;
    }
  });

  return report;
}
