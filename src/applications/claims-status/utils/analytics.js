import recordEvent from 'platform/monitoring/record-event';

// Session storage keys for upload tracking
const STORAGE_KEYS = {
  UPLOAD_ATTEMPTS: 'cst_upload_attempts',
  FAILED_UPLOADS: 'cst_failed_uploads',
};

// Time-to-live for session storage entries (2 hours in milliseconds)
const TIME_TO_LIVE = 2 * 60 * 60 * 1000;
// Fallback value for missing document type in analytics tracking
const UNKNOWN_DOC_TYPE = 'Unknown';

/**
 * Generates a unique document instance ID
 * @returns {string} Unique identifier for a document upload attempt
 */
export const generateDocInstanceId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers that don't support crypto.randomUUID
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 11)}`;
};

/**
 * Gets a storage item with TTL checking
 * @param {string} key - Storage key
 * @returns {any} Stored data or null if expired/not found
 */
const getStorageWithTTL = key => {
  try {
    const item = sessionStorage.getItem(key);

    if (!item) return null;

    const { data, timestamp } = JSON.parse(item);
    const now = Date.now();
    // Check if expired
    if (now - timestamp > TIME_TO_LIVE) {
      sessionStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    // If there's any error parsing, clear the item
    sessionStorage.removeItem(key);
    return null;
  }
};

/**
 * Sets a storage item with TTL
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
const setStorageWithTTL = (key, data) => {
  try {
    const item = {
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    // Silently fail if storage is full or unavailable
    // eslint-disable-next-line no-console
    console.warn('Failed to set session storage:', error);
  }
};

/**
 * Creates a file fingerprint for retry detection
 *
 * Uses extension + size + lastModified timestamp to uniquely identify files
 * without storing any PII.
 *
 * Collision only occurs if two different files have the exact same size AND
 * were modified at the exact same millisecond - extremely unlikely in practice.
 *
 * @param {File} file - File object
 * @returns {string} Fingerprint string (format: extension_size_timestamp)
 * @example
 * // Returns: "pdf_156789_1733356900000"
 * createFileFingerprint(myFile)
 */
const createFileFingerprint = file => {
  const extension = file.name.split('.').pop();
  const timestamp = file.lastModified || 0;

  return `${extension}_${file.size}_${timestamp}`;
};

/**
 * Stores a document upload attempt in sessionStorage for retry tracking
 * @param {Object} params - Upload attempt parameters
 * @param {string} params.docInstanceId - Document instance ID
 * @param {File} params.file - File being uploaded
 * @param {string} params.docType - Document type
 * @param {string} params.claimId - Claim ID
 */
export const storeUploadAttempt = ({
  docInstanceId,
  file,
  docType,
  claimId,
}) => {
  const attempts = getStorageWithTTL(STORAGE_KEYS.UPLOAD_ATTEMPTS) || {};
  const fingerprint = createFileFingerprint(file);

  if (!attempts[claimId]) {
    attempts[claimId] = {};
  }

  attempts[claimId][fingerprint] = {
    docInstanceId,
    docType,
    attempts: (attempts[claimId][fingerprint]?.attempts || 0) + 1,
    lastAttempt: Date.now(),
  };

  setStorageWithTTL(STORAGE_KEYS.UPLOAD_ATTEMPTS, attempts);
};

/**
 * Stores a failed upload in sessionStorage for retry tracking
 * @param {Object} params - Failed upload parameters
 * @param {string} params.docInstanceId - Document instance ID
 * @param {File} params.file - File that failed
 * @param {string} params.docType - Document type
 * @param {string} params.claimId - Claim ID
 * @param {string} params.errorCode - Error code if available
 */
export const storeFailedUpload = ({
  docInstanceId,
  file,
  docType,
  claimId,
  errorCode,
}) => {
  const failedUploads = getStorageWithTTL(STORAGE_KEYS.FAILED_UPLOADS) || {};
  const fingerprint = createFileFingerprint(file);

  if (!failedUploads[claimId]) {
    failedUploads[claimId] = {};
  }

  failedUploads[claimId][fingerprint] = {
    docInstanceId,
    docType,
    errorCode,
    failedAt: Date.now(),
  };

  setStorageWithTTL(STORAGE_KEYS.FAILED_UPLOADS, failedUploads);
};

/**
 * Checks if a file upload is a retry attempt
 * @param {File} file - File being uploaded
 * @param {string} claimId - Claim ID
 * @returns {Object} Retry information { isRetry, retryCount, previousDocInstanceId }
 */
export const checkIfRetry = (file, claimId) => {
  const attempts = getStorageWithTTL(STORAGE_KEYS.UPLOAD_ATTEMPTS) || {};
  const fingerprint = createFileFingerprint(file);
  const attemptData = attempts[claimId]?.[fingerprint];

  if (!attemptData) {
    return {
      isRetry: false,
      retryCount: 0,
      previousDocInstanceId: null,
    };
  }

  return {
    isRetry: attemptData.attempts > 0,
    retryCount: attemptData.attempts,
    previousDocInstanceId: attemptData.docInstanceId,
  };
};

/**
 * Clears upload tracking data for a specific claim
 * @param {string} claimId - Claim ID
 */
export const clearUploadTracking = claimId => {
  const attempts = getStorageWithTTL(STORAGE_KEYS.UPLOAD_ATTEMPTS) || {};
  const failedUploads = getStorageWithTTL(STORAGE_KEYS.FAILED_UPLOADS) || {};

  if (attempts[claimId]) {
    delete attempts[claimId];
    setStorageWithTTL(STORAGE_KEYS.UPLOAD_ATTEMPTS, attempts);
  }

  if (failedUploads[claimId]) {
    delete failedUploads[claimId];
    setStorageWithTTL(STORAGE_KEYS.FAILED_UPLOADS, failedUploads);
  }
};

/**
 * Records a Type 2 failure event for claims list page
 * Counts total number of slim alerts
 * Fires on every page visit when alerts are visible
 * @param {Object} params - Event parameters
 * @param {number} params.count - Number of slim alerts visible
 */
export const recordType2FailureEventListPage = ({ count }) => {
  recordEvent({
    event: 'claims-upload-failure-type-2',
    count,
    'entry-point': 'claims-list-page',
  });
};

/**
 * Records a Type 2 failure event for status page
 * Fires on every page visit when alert is visible (status tab only, not files tab)
 */
export const recordType2FailureEventStatusPage = () => {
  recordEvent({
    event: 'claims-upload-failure-type-2',
    'entry-point': 'claims-status-page',
  });
};

/**
 * Records an upload start event
 * Also stores upload attempts in sessionStorage for retry tracking
 * @param {Object} params - Event parameters
 * @param {Array<Object>} params.files - Files being uploaded
 * @param {string} params.claimId - Claim ID
 */
export const recordUploadStartEvent = ({ files, claimId }) => {
  // Check if any files are retries
  const filesWithRetryInfo = files.map(fileData => {
    const retryInfo = checkIfRetry(fileData.file, claimId);
    const docInstanceId = generateDocInstanceId();
    // Note: Frontend validation ensures docType is always present before submission,
    // but we use a fallback for defensive programming to ensure
    // analytics never breaks the upload flow if validation logic changes.
    const docType = fileData.docType?.value || UNKNOWN_DOC_TYPE;
    // Store this attempt in sessionStorage for retry tracking
    storeUploadAttempt({
      docInstanceId,
      file: fileData.file,
      docType,
      claimId,
    });

    return {
      docInstanceId,
      retryInfo,
      docType,
    };
  });

  // Count how many files are retries and sum total retry attempts
  const retryFileCount = filesWithRetryInfo.filter(
    fileInfo => fileInfo.retryInfo.isRetry,
  ).length;
  const totalRetryAttempts = filesWithRetryInfo.reduce(
    (totalAttempts, fileInfo) => totalAttempts + fileInfo.retryInfo.retryCount,
    0,
  );

  recordEvent({
    event: 'claims-upload-start',
    'file-count': files.length,
    'retry-file-count': retryFileCount,
    'total-retry-attempts': totalRetryAttempts,
  });

  return filesWithRetryInfo;
};

/**
 * Records an upload failure event (Type 1)
 * Also stores failed upload data in sessionStorage for retry tracking
 * @param {Object} params - Event parameters
 * @param {Array<Object>} params.errorFiles - Files that failed
 * @param {Array<Object>} params.files - Original files array (for matching file objects)
 * @param {Array<Object>} params.filesWithRetryInfo - Files with retry info from start event
 * @param {string} params.claimId - Claim ID
 */
export const recordUploadFailureEvent = ({
  errorFiles,
  files,
  filesWithRetryInfo,
  claimId,
}) => {
  // Store each failed upload in sessionStorage for retry tracking
  errorFiles.forEach((error, index) => {
    const fileInfo = filesWithRetryInfo?.[index];
    const fileObject = files?.[index]?.file;

    if (fileInfo && fileObject) {
      const errorCode = error?.errors?.[0]?.detail || UNKNOWN_DOC_TYPE;

      storeFailedUpload({
        docInstanceId: fileInfo.docInstanceId,
        file: fileObject,
        docType: error.docType || UNKNOWN_DOC_TYPE,
        claimId,
        errorCode,
      });
    }
  });

  recordEvent({
    event: 'claims-upload-failure',
    'failed-file-count': errorFiles.length,
    'error-code': errorFiles[0]?.errors?.[0]?.detail || UNKNOWN_DOC_TYPE,
  });
};

/**
 * Records an enhanced upload success event to Google Analytics
 * @param {Object} params - Event parameters
 * @param {number} params.fileCount - Number of files uploaded
 */
export const recordUploadSuccessEvent = ({ fileCount }) => {
  recordEvent({
    event: 'claims-upload-success',
    'file-count': fileCount,
  });
};
