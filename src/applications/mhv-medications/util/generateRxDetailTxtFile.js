import { generateTextFile, generateTimestampForFilename } from './helpers';

/**
 * Generate TXT file for a single medication detail
 * @param {Object} options
 * @param {Object} options.user - User information with first, last name
 * @param {boolean} options.isNonVaPrescription - Whether prescription is non-VA
 * @param {string} options.txtData - Text content for the file
 */
export function generateRxDetailTxtFile({ user, isNonVaPrescription, txtData }) {
  const filename = `${isNonVaPrescription ? 'Non-VA' : 'VA'}-medications-details-${
    user.first ? `${user.first}-${user.last}` : user.last
  }-${generateTimestampForFilename()}`;
  generateTextFile(txtData, filename);
}
