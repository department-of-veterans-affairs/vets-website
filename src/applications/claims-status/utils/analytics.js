import recordEvent from 'platform/monitoring/record-event';

/**
 * Analytics Event Schema for Upload Events
 *
 * All upload-related events follow a standardized structure for consistent
 * querying in Google Analytics. Each event populates relevant fields and
 * sets others to undefined.
 *
 * @typedef {Object} UploadAnalyticsEvent
 * @property {string} event - Event name (e.g., 'claims-upload-start', 'claims-upload-success')
 * @property {string} api-name - Human-readable API identifier
 * @property {string|undefined} api-status - 'started' | 'successful' | 'failed'
 * @property {string|undefined} error-key - Error code/identifier when applicable
 * @property {number|undefined} upload-cancel-file-count - Number of files being canceled
 * @property {number|undefined} upload-fail-alert-count - Count of Type 2 failure alerts visible
 * @property {number|undefined} upload-fail-file-count - Number of files that failed upload
 * @property {number|undefined} upload-file-count - Total files in upload batch
 * @property {boolean|undefined} upload-retry - Whether this upload includes retry attempts
 * @property {number|undefined} upload-retry-file-count - Number of files being retried
 * @property {number|undefined} upload-success-file-count - Number of files successfully uploaded
 */

/**
 * Base metadata keys for all upload analytics events.
 * Ensures consistent structure across all events for easier querying.
 * @type {Partial<UploadAnalyticsEvent>}
 */
const BASE_UPLOAD_EVENT_KEYS = {
  'api-name': undefined,
  'api-status': undefined,
  'error-key': undefined,
  'upload-cancel-file-count': undefined,
  'upload-fail-alert-count': undefined,
  'upload-fail-file-count': undefined,
  'upload-file-count': undefined,
  'upload-retry': undefined,
  'upload-retry-file-count': undefined,
  'upload-success-file-count': undefined,
};

/**
 * Creates an upload analytics event with standardized structure.
 * @param {string} eventName - The event name
 * @param {Partial<UploadAnalyticsEvent>} data - Event-specific data to merge with base keys
 * @returns {UploadAnalyticsEvent} The complete event object
 */
const createUploadEvent = (eventName, data) => ({
  event: eventName,
  ...BASE_UPLOAD_EVENT_KEYS,
  ...data,
});

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
export const recordType2FailureEvent = ({ count }) => {
  recordEvent(
    createUploadEvent('claims-upload-failure-type-2', {
      'api-name': 'Claims and Appeals Upload Fail Type 2 Alert',
      'upload-fail-alert-count': count,
    }),
  );
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

  recordEvent(
    createUploadEvent('claims-upload-start', {
      'api-name': 'Claims and Appeals Upload',
      'api-status': 'started',
      'upload-file-count': files.length,
      'upload-retry': retryFileCount > 0,
      'upload-retry-file-count': retryFileCount,
    }),
  );

  return { filesWithRetryInfo, retryFileCount };
};

/**
 * Records an upload failure event (Type 1)
 * Also stores failed upload data in sessionStorage for retry tracking
 * @param {Object} params - Event parameters
 * @param {Array<Object>} params.errorFiles - Files that failed
 * @param {Array<Object>} params.files - Original files array (for matching file objects)
 * @param {Array<Object>} params.filesWithRetryInfo - Files with retry info from start event
 * @param {string} params.claimId - Claim ID
 * @param {number} params.retryFileCount - Number of files that were retries
 */
export const recordUploadFailureEvent = ({
  errorFiles,
  files,
  filesWithRetryInfo,
  claimId,
  retryFileCount,
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

  recordEvent(
    createUploadEvent('claims-upload-failure', {
      'api-name': 'Claims and Appeals Upload',
      'api-status': 'failed',
      'error-key': errorFiles[0]?.errors?.[0]?.detail || UNKNOWN_DOC_TYPE,
      'upload-fail-file-count': errorFiles.length,
      'upload-retry': retryFileCount > 0,
      'upload-retry-file-count': retryFileCount,
    }),
  );
};

/**
 * Records an enhanced upload success event to Google Analytics
 * @param {Object} params - Event parameters
 * @param {number} params.fileCount - Number of files uploaded
 * @param {number} params.retryFileCount - Number of files that were retries
 */
export const recordUploadSuccessEvent = ({ fileCount, retryFileCount }) => {
  recordEvent(
    createUploadEvent('claims-upload-success', {
      'api-name': 'Claims and Appeals Upload',
      'api-status': 'successful',
      'upload-retry': retryFileCount > 0,
      'upload-retry-file-count': retryFileCount,
      'upload-success-file-count': fileCount,
    }),
  );
};

/**
 * Records an upload cancel event to Google Analytics
 * @param {Object} params - Event parameters
 * @param {number} params.cancelFileCount - Number of files being canceled
 * @param {number} params.retryFileCount - Number of canceled files that were retries
 */
export const recordUploadCancelEvent = ({
  cancelFileCount,
  retryFileCount,
}) => {
  recordEvent(
    createUploadEvent('claims-upload-cancel', {
      'api-name': 'Claims and Appeals Upload',
      'api-status': 'cancel',
      'upload-cancel-file-count': cancelFileCount,
      'upload-retry': retryFileCount > 0,
      'upload-retry-file-count': retryFileCount,
    }),
  );
};
