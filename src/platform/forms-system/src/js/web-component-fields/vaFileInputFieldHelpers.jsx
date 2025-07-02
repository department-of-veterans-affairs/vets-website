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
    );
    uploadRequest(dispatch, () => ({ form: { formId: formNumber } }));
  };
};

// Defaulting obj to {} in case we get a null
export const allKeysAreEmpty = (obj = {}) =>
  Object.keys(obj).every(key => !obj[key] || isEmpty(obj[key]));
