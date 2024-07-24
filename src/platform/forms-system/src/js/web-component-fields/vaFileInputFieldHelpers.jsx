import { uploadFile } from 'platform/forms-system/src/js/actions';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

export const areFilesEqual = (file1, file2) => {
  if (file1 === null || file2 === null) {
    return false;
  }

  return (
    file1.name === file2.name &&
    file1.size === file2.size &&
    file1.type === file2.type &&
    file1.lastModified === file2.lastModified
  );
};

const createPayload = (file, formId) => {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  return payload;
};

export const uploadScannedForm = (formNumber, fileToUpload, onFileUploaded) => {
  const uiOptions = {
    fileUploadUrl: `${
      environment.API_URL
    }/simple_forms_api/v1/scanned_form_upload`,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSize: MAX_FILE_SIZE_BYTES,
    createPayload,
    parseResponse: ({ data }) => data?.attributes,
  };

  return dispatch => {
    const uploadRequest = uploadFile(
      fileToUpload,
      uiOptions,
      () => {}, // onProgress
      file => onFileUploaded(file),
      () => {}, // onError
    );
    uploadRequest(dispatch, () => ({ form: { formId: formNumber } }));
  };
};
