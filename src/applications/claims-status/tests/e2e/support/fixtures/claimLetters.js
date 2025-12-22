/**
 * Creates a claim letter object
 *
 * @param {Object} overrides - Properties to override defaults
 * @param {string} overrides.documentId - Unique document ID
 * @param {string} overrides.receivedAt - Date the letter was received
 * @param {string} overrides.typeDescription - Type description
 * @param {string} overrides.typeId - Type ID
 * @param {string} overrides.docType - Document type code
 * @returns {Object} Claim letter object
 */
export const createClaimLetter = ({
  documentId = '{9FE306BA-28EF-4012-875A-1B4EEBACE931}',
  receivedAt = '2020-07-11',
  typeDescription = 'Notification Letter (e.g. VA 20-8993, VA 21-0290, PCGL)',
  typeId = '184',
  docType = '184',
} = {}) => ({
  documentId,
  seriesId: '{BEC51E8E-81C1-403F-9E27-F82F4CA1F5DD}',
  version: '1',
  typeDescription,
  typeId,
  docType,
  subject: null,
  receivedAt,
  source: 'Virtual VA',
  mimeType: 'application/pdf',
  altDocTypes: null,
  restricted: false,
  uploadDate: receivedAt,
});

/**
 * Creates multiple claim letters for pagination testing
 *
 * @param {number} count - Number of letters to create
 * @param {Object} overrides - Properties to override defaults for each letter
 * @returns {Array} Array of claim letter objects
 */
export const createMultipleClaimLetters = (count, overrides = {}) => {
  return Array.from({ length: count }, (_, i) =>
    createClaimLetter({
      documentId: `{9FE306BA-28EF-4012-875A-1B4EEBACE${String(931 + i).padStart(
        3,
        '0',
      )}}`,
      receivedAt: `2020-07-${String(11 + Math.floor(i / 10)).padStart(2, '0')}`,
      ...overrides,
    }),
  );
};
