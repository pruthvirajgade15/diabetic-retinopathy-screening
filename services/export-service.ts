import { ScreeningResult } from '@/types';

/**
 * Exports clinical screening result as an audit JSON file
 */
export function exportScreeningJSON(result: ScreeningResult): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `DR-Screening-Report-${result.patientId}-${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Triggers the browser print dialog for PDF generation
 */
export function printClinicalReport(): void {
  window.print();
}
