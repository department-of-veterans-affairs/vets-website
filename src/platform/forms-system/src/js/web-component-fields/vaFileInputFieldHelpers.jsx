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
) => {
  const uiOptions = {
    fileUploadUrl,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
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
    );
    uploadRequest(dispatch, () => ({ form: { formId: formNumber } }));
  };
};

export const getFileSize = num => {
  if (num > 999999) {
    return `${(num / 1000000).toFixed(1)} MB`;
  }
  if (num > 999) {
    return `${Math.floor(num / 1000)} KB`;
  }
  return `${num} B`;
};

export const allKeysAreEmpty = obj => Object.keys(obj).every(key => !obj[key]);
