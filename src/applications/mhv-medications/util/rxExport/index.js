/**
 * Rx Export Module
 *
 * This module provides a unified API for exporting prescription data
 * in PDF and TXT formats. It consolidates logic that was previously
 * duplicated across containers and util files.
 *
 * Usage with useRxExport hook (recommended):
 *
 * ```javascript
 * import { useRxExport } from '../hooks/useRxExport';
 *
 * const { exportRxList, exportRxDetails, isExportInProgress, isExportSuccess } = useRxExport({
 *   userName,
 *   dob,
 *   allergies,
 *   allergiesError,
 *   options: { isCernerPilot, isV2StatusMapping }
 * });
 *
 * // Export medications list as PDF
 * exportRxList.pdf({
 *   rxPdfList,      // Array - built via buildPrescriptionsPDFList()
 *   preface,        // Array - built via displayHeaderPrefaceText(..., true) for PDF
 *   listHeader      // String - built via displayMedicationsListHeader()
 * });
 *
 * // Export medications list as TXT
 * exportRxList.txt({
 *   rxContent,      // String - built via buildPrescriptionsTXT()
 *   preface,        // String - built via displayHeaderPrefaceText(..., false) for TXT
 *   listHeader      // String - built via displayMedicationsListHeader()
 * });
 *
 * // Export single Rx details as PDF
 * exportRxDetails.pdf({
 *   rxName,         // String - prescription name
 *   rxPdfList,      // Array - prescription PDF field list
 *   isNonVA         // Boolean - whether it's a non-VA prescription
 * });
 *
 * // Export single Rx details as TXT
 * exportRxDetails.txt({
 *   rxContent,      // String - formatted prescription text content
 *   isNonVA         // Boolean - whether it's a non-VA prescription
 * });
 * ```
 *
 * Direct service usage (advanced):
 *
 * ```javascript
 * import { createExportService } from '../util/rxExport';
 *
 * const exportService = createExportService({
 *   userName: { first: 'John', last: 'Doe' },
 *   dob: '1990-01-01',
 *   options: { isCernerPilot: false, isV2StatusMapping: false }
 * });
 *
 * // Export Rx list as PDF
 * await exportService.exportRxListPdf({ rxPdfList, allergies, preface, listHeader });
 *
 * // Export Rx details as PDF
 * await exportService.exportRxDetailsPdf({ rxName, rxPdfList, allergies, isNonVA });
 *
 * // Or build documents manually for more control
 * const pdfData = exportService.pdfBuilder.buildRxListPdf({ rxList, allergies, preface, listHeader });
 * const txtContent = exportService.txtBuilder.buildRxDetailsTxt({ rxContent, allergies });
 * ```
 */

// Main service and document builders
export {
  createExportService,
  createPdfDocumentBuilder,
  createTxtDocumentBuilder,
} from './documentBuilders';

// Formatters for data transformation
export {
  formatDate,
  formatProviderName,
  formatUserFullName,
  formatUserNameForFilename,
  formatDob,
  formatList,
  validateField,
  validateFieldWithName,
  generateTimestamp,
  DATETIME_FORMATS,
  FIELD_NONE_NOTED,
  FIELD_NOT_AVAILABLE,
  NO_PROVIDER_NAME,
} from './formatters';

// Static content and messages
export {
  CRISIS_LINE_PDF,
  CRISIS_LINE_TXT,
  ALLERGIES_SECTION_HEADER,
  ALLERGIES_DESCRIPTION,
  ALLERGIES_EMPTY_MESSAGE,
  ALLERGIES_ERROR_MESSAGE,
  SINGLE_MEDICATION_PREFACE,
  NON_VA_MEDICATION_DESCRIPTION,
  ACTIVE_NON_VA,
  PDF_FOOTER_RIGHT,
  TXT_SEPARATOR,
  reportGeneratedBy,
  getReportGeneratedText,
  getAllergiesCountText,
} from './staticContent';

// Allergy builders
export {
  buildAllergyPdfItem,
  buildAllergyTxtItem,
  buildAllergiesPdfList,
  buildAllergiesPdfSection,
  buildAllergiesTxtSection,
} from './rxBuilders';

// High-level prescription builders (PDF and TXT)
export {
  buildNonVAPrescriptionPDFList,
  buildPrescriptionsPDFList,
  buildMedicationInformationPDF,
  buildAllergiesPDFList,
  buildVAPrescriptionPDFList,
  buildNonVAPrescriptionTXT,
  buildPrescriptionsTXT,
  buildAllergiesTXT,
  buildVAPrescriptionTXT,
} from './prescriptionBuilders';

// Low-level generators
export { generatePdf, generateTxt, generateExportFilename } from './generators';
