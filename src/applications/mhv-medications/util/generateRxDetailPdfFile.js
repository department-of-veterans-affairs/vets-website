import {
  generateMedicationsPDF,
  generateTimestampForFilename,
} from './helpers';

/**
 * Generate PDF file for a single medication detail
 * @param {Object} options
 * @param {Object} options.user - User information with first, last name
 * @param {boolean} options.isNonVaPrescription - Whether prescription is non-VA
 * @param {Object} options.pdfData - PDF data object
 */
export async function generateRxDetailPdfFile({
  user,
  isNonVaPrescription,
  pdfData,
}) {
  const prefix = isNonVaPrescription ? 'Non-VA' : 'VA';
  const name = user.first ? `${user.first}-${user.last}` : user.last;
  const filename = `${prefix}-medications-details-${name}-${generateTimestampForFilename()}`;
  await generateMedicationsPDF('medications', filename, pdfData);
}
