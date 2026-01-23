/**
 * Rx Export Module
 *
 * This module provides a unified API for exporting prescription data
 * in PDF and TXT formats. It consolidates logic that was previously
 * duplicated across containers and util files.
 *
 * Usage:
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
 * // Export single Rx details
 * await exportService.exportRxDetailsPdf({
 *   rxName: 'Aspirin',
 *   rxPdfList: [...],
 *   allergies: [...],
 *   isNonVA: false
 * });
 *
 * // Or build documents manually for more control
 * const pdfData = exportService.pdfBuilder.buildRxDetailsPdf({...});
 * const txtContent = exportService.txtBuilder.buildRxDetailsTxt({...});
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
  reportGeneratedBy,
  getReportGeneratedText,
  getAllergiesCountText,
} from './staticContent';

// Rx field builders
export {
  createPdfField,
  createTxtField,
  buildInstructionsField,
  buildReasonForUseField,
  buildFacilityField,
  buildProviderField,
  buildDateField,
  buildPharmacyPhoneField,
  buildNonVARxFields,
  buildAllergyPdfItem,
  buildAllergyTxtItem,
  buildAllergiesPdfList,
  buildAllergiesPdfSection,
  buildAllergiesTxtSection,
} from './rxBuilders';

// Low-level generators
export { generatePdf, generateTxt, generateExportFilename } from './generators';
