/**
 * Utility functions for v3 file input multiple component
 */

/**
 * Matches errors to files based on the file characteristics rather
 * than their position within the respective arrays
 * @param {Object} e File event, e.g. an upload/change/removal
 * @param {Array} errList list of error objects for uploaded files
 * @returns Array of objects containing file details + an errorMessage property
 * e.g.: [{name: 'file.png', size: 123, errorMessage: 'Too large'}]
 */
export function getErrorsForFiles(e, errList) {
  const fileEntries = e?.detail?.state;
  return fileEntries.map(entry => {
    if (!entry.file) {
      return '';
    }
    // Match errors to files based on their characteristics rather
    // than their array position:
    return errList.find(
      err => err?.name === entry?.file?.name && err?.size === entry?.file?.size,
    );
  });
}

/**
 * Creates an error message for a file that is still uploading
 * @param {Object} f File object
 * @param {String} message Message to display
 * @returns Object containing error message details
 */
export function addLoadingMsg(f, message) {
  return {
    name: f?.name,
    size: f?.size,
    errorMessage: message,
  };
}

/**
 * Identifies the overlap in two arrays of files based on file name and size
 * @param {Array} arr1 Array to check against
 * @param {Array} arr2 Array to be narrowed down based on the presence of files in arr1
 * @returns {Array} Filtered array containing only matching elements
 */
export function filterToMatchingObjects(arr1, arr2) {
  // Create a Set of unique identifier strings from arr1
  const arr1Identifiers = new Set(
    arr1.map(item => `${item.name}-${item.size}`),
  );

  // Filter arr2 to only include items whose identifiers exist in the Set
  return arr2.filter(item => arr1Identifiers.has(`${item.name}-${item.size}`));
}

/**
 * Finds the index of an object in an array that matches the given properties
 * @param {Array} arr - The array to search
 * @param {Object} properties - The properties to match, e.g., {size: 123, name: 'test.png'}
 * @returns {number} The index of the matching object, or -1 if not found
 */
export function indexOfMatch(arr, properties) {
  return arr.findIndex(obj => {
    return Object.keys(properties).every(key => obj[key] === properties[key]);
  });
}

/**
 * Creates a file object from an uploaded file
 * @param {Object} uploadedFile The file that was uploaded
 * @returns {Object} Formatted file object for storage
 */
export function createFileObject(uploadedFile) {
  const localFilePath = URL.createObjectURL(uploadedFile.file);
  return {
    lastModified: uploadedFile.file.lastModified,
    lastModifiedDate: uploadedFile.file.lastModifiedDate,
    type: uploadedFile.file.type,
    name: uploadedFile.name,
    size: uploadedFile.size,
    warnings: uploadedFile.warnings,
    confirmationCode: uploadedFile.confirmationCode,
    isEncrypted: uploadedFile.isEncrypted,
    localFilePath,
  };
}
