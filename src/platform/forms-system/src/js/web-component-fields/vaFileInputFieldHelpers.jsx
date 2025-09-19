import { useState } from 'react';
import { isEmpty } from 'lodash';
import { uploadFile } from 'platform/forms-system/src/js/actions';
import {
  standardFileChecks,
  FILE_TYPE_MISMATCH_ERROR,
} from 'platform/forms-system/src/js/utilities/file';
import {
  UNSUPPORTED_ENCRYPTED_FILE_ERROR,
  UTF8_ENCODING_ERROR,
} from '../validation';

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

const createPayload = (file, formId) => {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  return payload;
};

export const uploadScannedForm = (
  fileUploadUrl,
  formNumber,
  fileToUpload,
  onFileUploaded,
  onProgress,
  accept = '.pdf,.jpeg,.png',
  password,
) => {
  const uiOptions = {
    fileUploadUrl,
    fileTypes: accept.split(','),
    maxSize: MAX_FILE_SIZE_BYTES,
    createPayload,
    parseResponse: ({ data }, file) => ({ ...data?.attributes, file }),
  };

  return dispatch => {
    const uploadRequest = uploadFile(
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

export const useFileUpload = (fileUploadUrl, accept, formNumber, dispatch) => {
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
      uploadScannedForm(
        fileUploadUrl,
        formNumber,
        file,
        onFileUploaded,
        onFileUploading,
        accept,
        password,
      ),
    );
  };

  return { isUploading, percentUploaded, handleUpload };
};

/**
 *
 * @param {File} file the file to upload
 * @returns {string | null} the error if one present else null
 */
export async function getFileError(file, uiOptions) {
  const checks = await standardFileChecks(file);
  let fileError = null;
  if (!checks.checkTypeAndExtensionMatches) {
    fileError = FILE_TYPE_MISMATCH_ERROR;
  }

  if (!!checks.checkIsEncryptedPdf && uiOptions.disallowEncryptedPdfs) {
    fileError = UNSUPPORTED_ENCRYPTED_FILE_ERROR;
  }

  if (!checks.checkUTF8Encoding) {
    fileError = UTF8_ENCODING_ERROR;
  }

  return { fileError, encryptedCheck: !!checks.checkIsEncryptedPdf };
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
