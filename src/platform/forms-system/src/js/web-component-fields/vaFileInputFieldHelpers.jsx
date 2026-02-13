import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { uploadFile as _uploadFile } from 'platform/forms-system/src/js/actions';
import {
  standardFileChecks,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';
import {
  UNSUPPORTED_ENCRYPTED_FILE_ERROR,
  UTF8_ENCODING_ERROR,
  DUPLICATE_FILE_ERROR,
} from '../validation';

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

const createPayloadDefault = (file, formId, password = null) => {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  if (password) payload.append('password', password);
  return payload;
};

const parseResponseDefault = ({ data }, file) => ({
  ...data?.attributes,
  file,
});

export const uploadFile = (
  fileUploadUrl,
  formNumber,
  fileToUpload,
  onFileUploaded,
  onProgress,
  accept = '.pdf,.jpeg,.png',
  password,
  createPayload,
  parseResponse,
) => {
  const uiOptions = {
    fileUploadUrl,
    fileTypes: accept.split(','),
    maxSize: MAX_FILE_SIZE_BYTES,
    createPayload: createPayload || createPayloadDefault,
    parseResponse: parseResponse || parseResponseDefault,
  };

  return dispatch => {
    const uploadRequest = _uploadFile(
      fileToUpload,
      uiOptions,
      onProgress,
      file => onFileUploaded(file),
      () => {}, // onError
      '', // tracking prefix placeholder
      password,
    );
    uploadRequest(dispatch, () => ({ form: { formId: formNumber } }));
  };
};

/**
 * Not used in form system but imported elsewhere in applications
 * Remove when possible.
 */
export const getFileSize = num => {
  if (num > 999999) {
    return `${(num / 1000000).toFixed(1)} MB`;
  }
  if (num > 999) {
    return `${Math.floor(num / 1000)} KB`;
  }
  return `${num} B`;
};

// Defaulting obj to {} in case we get a null
export const allKeysAreEmpty = (obj = {}) =>
  Object.keys(obj).every(key => !obj[key] || isEmpty(obj[key]));

export const useFileUpload = (
  { fileUploadUrl, formNumber, createPayload, parseResponse },
  accept,
  dispatch,
) => {
  const [isUploading, setIsUploading] = useState(false);
  const [percentUploaded, setPercentUploaded] = useState(null);

  const handleUpload = (file, onSuccess, password = null, fileIndex) => {
    setIsUploading(true);

    const onFileUploaded = uploadedFile => {
      setIsUploading(false);
      setPercentUploaded(null);
      if (onSuccess) onSuccess(uploadedFile, fileIndex);
    };

    const onFileUploading = percent => {
      setPercentUploaded(percent);
      setIsUploading(true);
    };

    dispatch(
      uploadFile(
        fileUploadUrl,
        formNumber,
        file,
        onFileUploaded,
        onFileUploading,
        accept,
        password,
        createPayload,
        parseResponse,
      ),
    );
  };

  return { isUploading, percentUploaded, handleUpload };
};

/**
 * Converts the size of a file from bytes to a more human-readable format for
 * rendering the file size label. This function calculates the file size in
 * appropriate units (B, KB, MB, GB, TB) based on the size provided. It uses
 * logarithmic scaling to determine the unit, then formats the size to one
 * decimal place for units KB and above.
 *
 * @param {number} filesSize - The size of the file in bytes
 * @returns {string} - The formatted file size with appropriate unit
 */
export function formatFileSize(filesSize) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (filesSize === 0) return '0 B';

  const unitIndex = Math.floor(Math.log(filesSize) / Math.log(1024));
  if (unitIndex === 0) return `${filesSize} ${units[unitIndex]}`;

  const sizeInUnit = filesSize / 1024 ** unitIndex;
  const formattedSize = sizeInUnit.toFixed(unitIndex < 2 ? 0 : 1);
  return `${formattedSize}\xa0${units[unitIndex]}`;
}

/** Return an error message if a file is too big or too small
 * @param {string | undefined} type - the type of the uploaded file or undefined if a limit for that type was not provided
 * @param {number} size - the size of the file
 * @param {boolean} tooBig - was the error because the file was too big - false means it was due to file being too small
 * @returns {string} - The error message
 */
function getFileSizeError(type, size, tooBig) {
  const description = type ? `${type} files` : 'Files';
  const comparison = tooBig ? 'less than' : 'at least';
  return `We can't upload your file because it's too ${
    tooBig ? 'big' : 'small'
  }. ${description} must be ${comparison} ${formatFileSize(size)}.`;
}

/** @typedef {maxFileSize: number, minFileSize: number} FileSizeLimits */
/** @typedef {Record<string, FileSizeLimits>} FileSizeMap */

/**
 * @param {File} file - uploaded file
 * @param {FileSizeMap} fileSizesByFileType - map of file types to max/min file sizes
 * @returns {string | null}
 */
function checkFileSizeByFileType(
  file,
  fileSizesByFileType,
  maxFileSize,
  minFileSize,
) {
  const { type, size } = file;
  const _type = type.includes('text') ? 'txt' : type.split('/')[1];
  const limits = fileSizesByFileType[_type] || fileSizesByFileType.default;
  const { minFileSize: _minFileSize, maxFileSize: _maxFileSize } = limits || {};

  // file size limits from fileSizesByFileType take precedence if the user also provides maxFileSize / minFileSize in uiOptions
  const maxLimit = _maxFileSize || maxFileSize;
  const minLimit = _minFileSize || minFileSize;
  let error = null;
  if (maxLimit && size > maxLimit) {
    error = getFileSizeError(!!limits && _type, maxLimit, true);
  }
  if (minLimit && size < minLimit) {
    error = getFileSizeError(!!limits && _type, minLimit, false);
  }
  return error;
}

/**
 *
 * @param {File} file the file to upload
 * @param { boolean } disallowEncryptedPdfs flag to prevent encrypted pdfs
 * @param { Object[] } files array of previously uploaded files
 * @returns {Promise<string | null>} the error if one present else null
 */
export async function getFileError(
  file,
  { disallowEncryptedPdfs, fileSizesByFileType, maxFileSize, minFileSize },
  files = [],
) {
  let fileError = null;
  let encryptedCheck = null;

  for (const f of files) {
    if (f.name === file.name && f.size === file.size) {
      fileError = DUPLICATE_FILE_ERROR;
      break;
    }
  }

  // always check file size; we don't rely on component file size validation
  fileError = checkFileSizeByFileType(
    file,
    fileSizesByFileType,
    maxFileSize,
    minFileSize,
  );

  // don't do more checks if there is a duplicate file or file size error
  if (!fileError) {
    const checks = await standardFileChecks(file);
    encryptedCheck = !!checks.checkIsEncryptedPdf;

    if (!checks.checkTypeAndExtensionMatches) {
      fileError = FILE_TYPE_MISMATCH_ERROR;
    }

    if (!!checks.checkIsEncryptedPdf && disallowEncryptedPdfs) {
      fileError = UNSUPPORTED_ENCRYPTED_FILE_ERROR;
    }

    if (!checks.checkUTF8Encoding) {
      fileError = UTF8_ENCODING_ERROR;
    }
  }

  return { fileError, encryptedCheck };
}

/**
 * @param {Object} file representation of a file
 * @returns { File } dummy file that will force component to render default file icon
 */
export function makePlaceholderFile(file = {}) {
  const buffer = new ArrayBuffer(file?.size || 1024);
  const type = file?.type || 'image/png';
  const blob = new Blob([buffer], { type });
  return new File([blob], file?.name || 'placeholder', {
    type,
  });
}

export const DEBOUNCE_WAIT = 500;

// generate file data when no backend
function getMockFileData(file) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    confirmationCode: `mock-upload-${Date.now()}`,
  };
}

const START_PERCENT = 10;
const PERCENT_MAX_STEP = 20;
const INTERVAL = 50;

/**
 * This function invoked for mock form on staging which lacks a back-end but where we would like to show the progress of uploads.
 * @param {Function} setPercent - function to set percent uploaded value
 * @param {Function} update - function that updates the form state
 * @param {File} file - the file to be uploaded
 */
export function simulateUploadSingle(setPercent, update, file) {
  let per = START_PERCENT;
  const id = setInterval(() => {
    setPercent(per);
    if (per >= 100) {
      update(getMockFileData(file));
      setPercent(null);
      clearInterval(id);
    }
    per += Math.random() * PERCENT_MAX_STEP;
  }, INTERVAL);
}

/**
 * This function invoked skipUpload is true. Simulates progress of upload.
 * @param {Function} setPercentsUploaded - function to set array of percent uploaded value
 * @param {Array<string>} percentsUploaded - array of percent uploaded values
 * @param {number} index - index of the file
 * @param {Object} childrenProps - props passed to field, including data and onchange function
 * @param {File} file - the file to be uploaded
 */
export function simulateUploadMultiple(
  setPercentsUploaded,
  percentsUploaded,
  index,
  childrenProps,
  file,
) {
  let per = START_PERCENT;
  const id = setInterval(() => {
    const _percents = [...percentsUploaded];
    _percents[index] = per;
    setPercentsUploaded(_percents);
    if (per >= 100) {
      const files = [...childrenProps.formData];
      files[index] = getMockFileData(file);
      childrenProps.onChange(files);
      _percents[index] = null;
      setPercentsUploaded(_percents);
      clearInterval(id);
    }
    per += Math.random() * PERCENT_MAX_STEP;
  }, INTERVAL);
}

const UPLOADING_MESSAGE = 'Uploading file';
const UPLOADING_DONE_MESSAGE = 'File uploaded';
export function VaProgressUploadAnnounce({ uploading }) {
  const [sRMessage, setSRMessage] = useState('');
  useEffect(
    () => {
      if (uploading) {
        setSRMessage(UPLOADING_MESSAGE);
      } else if (!uploading && sRMessage) {
        setSRMessage(UPLOADING_DONE_MESSAGE);
      }
    },
    [uploading],
  );

  return (
    <span
      aria-atomic="true"
      role="alert"
      aria-live="polite"
      className="sr-only"
    >
      {sRMessage}
    </span>
  );
}
