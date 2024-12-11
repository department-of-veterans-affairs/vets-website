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
