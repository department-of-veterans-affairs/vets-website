import {
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  MAX_PDF_FILE_SIZE_MB,
  MAX_PDF_FILE_SIZE_BYTES,
} from 'applications/disability-benefits/all-claims/constants';

import {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  FILE_TYPE_MISMATCH_ERROR,
  checkIsEncryptedPdf,
} from 'platform/forms-system/src/js/utilities/file';

// Error messages
export const FILE_SIZE_ERROR_PDF = `The file you selected is larger than the ${MAX_PDF_FILE_SIZE_MB}MB maximum file size and could not be added.`;
export const FILE_SIZE_ERROR_NON_PDF = `The file you selected is larger than the ${MAX_FILE_SIZE_MB}MB maximum file size and could not be added.`;
export const VALIDATION_ERROR = 'Please select a file first';
export const PASSWORD_ERROR = 'Please provide a password to decrypt this file';
export const DOC_TYPE_ERROR = 'Please provide a document type';

// Helper functions
export const isPdf = file => file.name?.toLowerCase().endsWith('.pdf') ?? false;

const validateFileSize = file => {
  const maxSize = isPdf(file) ? MAX_PDF_FILE_SIZE_BYTES : MAX_FILE_SIZE_BYTES;

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

// File encryption utilities
const checkFileEncryption = async file => {
  if (!isPdf(file)) {
    return false;
  }

  try {
    const checks = { checkIsEncryptedPdf };
    const checkResults = await readAndCheckFile(file, checks);
    return checkResults.checkIsEncryptedPdf;
  } catch (error) {
    return false;
  }
};

export const createEncryptedFilesList = async files => {
  return Promise.all(
    files.map(async fileInfo => checkFileEncryption(fileInfo.file)),
  );
};

// Shadow DOM extraction utilities
export const extractPasswordsFromShadowDOM = (
  fileInputRef,
  files,
  encrypted,
) => {
  const updatedFiles = [...files];
  const vaFileInputElements = fileInputRef.current?.shadowRoot?.querySelectorAll(
    'va-file-input',
  );

  if (vaFileInputElements) {
    vaFileInputElements.forEach((vaFileInput, index) => {
      if (encrypted[index]) {
        const vaTextInput = vaFileInput.shadowRoot?.querySelector(
          'va-text-input',
        );
        const passwordInput = vaTextInput?.shadowRoot?.querySelector('input');
        if (passwordInput && updatedFiles[index]) {
          updatedFiles[index] = {
            ...updatedFiles[index],
            password: passwordInput.value,
          };
        }
      }
    });
  }

  return updatedFiles;
};

export const extractDocumentTypesFromShadowDOM = fileInputRef => {
  const fileInputs = Array.from(
    fileInputRef.current?.shadowRoot?.querySelectorAll('va-file-input') || [],
  );

  return fileInputs.map(fileInput => {
    const vaSelect = fileInput.querySelector('va-select');
    return vaSelect?.value || '';
  });
};

// Error handling utilities
export const clearNoFilesError = prevErrors => {
  if (prevErrors.length === 1 && prevErrors[0] === VALIDATION_ERROR) {
    return [];
  }
  return prevErrors;
};

export const clearSpecificErrors = (prevErrors, errorType, shouldClear) => {
  const newErrors = [...prevErrors];
  let hasChanges = false;

  prevErrors.forEach((error, index) => {
    if (error === errorType && shouldClear(index)) {
      newErrors[index] = null;
      hasChanges = true;
    }
  });

  return hasChanges ? newErrors : prevErrors;
};

export const rebuildErrorsAfterFileDeletion = (
  currentFiles,
  newFiles,
  prevErrors,
) => {
  const newErrors = [];
  // Match errors to files by file reference, not by index
  newFiles.forEach((fileInfo, newIndex) => {
    const originalIndex = currentFiles.findIndex(f => f.file === fileInfo.file);
    if (originalIndex !== -1 && prevErrors[originalIndex]) {
      newErrors[newIndex] = prevErrors[originalIndex];
    }
  });
  return newErrors;
};

export const updateErrorsOnFileChange = (
  prevErrors,
  files,
  newFiles,
  action,
) => {
  // First, clear "no files" error if present
  let updatedErrors = clearNoFilesError(prevErrors);

  // Handle errors based on the specific action
  if (action === 'FILE_REMOVED') {
    // Rebuild error array to match remaining files
    updatedErrors = rebuildErrorsAfterFileDeletion(files, newFiles, prevErrors);
  } else if (action === 'PASSWORD_UPDATE') {
    // Clear password errors when passwords are provided
    updatedErrors = clearSpecificErrors(
      updatedErrors,
      PASSWORD_ERROR,
      index =>
        newFiles[index]?.password && newFiles[index].password.trim() !== '',
    );
  }

  return updatedErrors;
};

export const applyValidationErrors = (
  baseErrors,
  validationResults,
  files,
  wasFileReplaced = false,
) => {
  const updatedErrors = [...baseErrors];
  if (wasFileReplaced) {
    // Clear ALL errors when a file was replaced (FILE_UPDATED action) - fresh validation for replaced files
    files.forEach((_, index) => {
      updatedErrors[index] = null;
    });
  }

  // Apply new validation errors
  validationResults.forEach(result => {
    updatedErrors[result.index] = result.error;
  });

  return updatedErrors;
};

// Validation and submission utilities
export const validateFilesForSubmission = (
  files,
  encrypted,
  docTypes,
  existingErrors,
) => {
  // Check if no files provided (always required)
  if (files.length === 0) {
    return { isValid: false, errors: [VALIDATION_ERROR] };
  }

  // Re-enable checking existing errors (file validation errors)
  const errors = [...(existingErrors || [])];
  let hasErrors = false;

  files.forEach((fileInfo, index) => {
    // Check existing validation errors
    if (errors[index]) {
      hasErrors = true;
    }
    // Check if file is encrypted and missing password
    else if (
      encrypted[index] &&
      (!fileInfo.password || fileInfo.password.trim() === '')
    ) {
      errors[index] = PASSWORD_ERROR;
      hasErrors = true;
    }
    // Check if document type is missing or empty
    else if (!docTypes[index] || docTypes[index].trim() === '') {
      errors[index] = DOC_TYPE_ERROR;
      hasErrors = true;
    }
  });

  return {
    isValid: !hasErrors,
    errors: hasErrors ? errors : [],
  };
};
