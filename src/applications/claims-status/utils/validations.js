import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';

export const FILE_TYPES = ['pdf', 'gif', 'jpeg', 'jpg', 'bmp', 'txt'];
// File validation constants
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2;
const MAX_PDF_SIZE_MB = 99; // Note: UI hint says 150MB but code validates 99MB
const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 ** 2;

// Error messages
const FILE_SIZE_ERROR_PDF = `The file you selected is larger than the ${MAX_PDF_SIZE_MB}MB maximum file size and could not be added.`;
const FILE_SIZE_ERROR_NON_PDF = `The file you selected is larger than the ${MAX_FILE_SIZE_MB}MB maximum file size and could not be added.`;

// Helper functions
const isPdf = file => file.name?.toLowerCase().endsWith('.pdf');

const validateFileSize = file => {
  const maxSize = isPdf(file) ? MAX_PDF_SIZE_BYTES : MAX_FILE_SIZE_BYTES;

  if (file.size > maxSize) {
    return isPdf(file) ? FILE_SIZE_ERROR_PDF : FILE_SIZE_ERROR_NON_PDF;
  }

  return null; // Valid
};

/**
 * Validates a single file and returns any error message
 * @param {File} file - The file to validate
 * @returns {Promise<string|null>} Error message or null if valid
 */
export const validateFile = async file => {
  if (!file) return null;

  const sizeError = validateFileSize(file);

  if (sizeError) return sizeError;

  // Check file extension matches content
  try {
    const checks = { checkTypeAndExtensionMatches };
    const checkResults = await readAndCheckFile(file, checks);
    if (!checkResults.checkTypeAndExtensionMatches) {
      return FILE_TYPE_MISMATCH_ERROR;
    }
  } catch (error) {
    // If we can't read the file, we'll let it through
    // and handle it during submission
  }

  return null;
};

/**
 * Validates multiple files in parallel
 * @param {Array} fileInfos - Array of file info objects with file property
 * @returns {Promise<Array>} Array of validation results {index, error}
 */
export const validateFiles = async fileInfos => {
  const validationPromises = fileInfos.map(async (fileInfo, index) => {
    if (!fileInfo?.file) return null;

    const error = await validateFile(fileInfo.file);
    return error ? { index, error } : null;
  });

  const results = await Promise.all(validationPromises);
  return results.filter(result => result !== null);
};
