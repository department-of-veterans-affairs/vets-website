import { useState } from 'react';
import { isEmpty } from 'lodash';
import { uploadFile } from 'platform/forms-system/src/js/actions';

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

  const handleUpload = (file, onSuccess, password = null) => {
    setIsUploading(true);

    const onFileUploaded = uploadedFile => {
      setIsUploading(false);
      setPercentUploaded(null);
      if (onSuccess) onSuccess(uploadedFile);
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
