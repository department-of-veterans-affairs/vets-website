import { generateTimestampForFilename } from './generateTimestampForFilename';

/**
 * Generate the filename for a single medication detail export
 * @param {Object} options
 * @param {Object} options.user - User information with first, last name
 * @param {boolean} options.isNonVaPrescription - Whether prescription is non-VA
 * @returns {string} The generated filename without extension
 */
export const generateRxDetailFilename = ({ user, isNonVaPrescription }) => {
  const prefix = isNonVaPrescription ? 'Non-VA' : 'VA';
  const name = user.first ? `${user.first}-${user.last}` : user.last;
  return `${prefix}-medications-details-${name}-${generateTimestampForFilename()}`;
};
