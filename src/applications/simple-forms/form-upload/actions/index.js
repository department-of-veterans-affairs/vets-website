import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { uploadFile } from 'platform/forms-system/src/js/actions';

export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

export const createPayload = (file, formId) => {
  const payload = new FormData();
  payload.set('form_id', formId);
  payload.append('file', file);
  return payload;
};

export const parseResponse = ({ data }) => {
  const { confirmationCode, name } = data.attributes;

  return { name, confirmationCode };
};

export function submitToSimpleForms(formNumber, fileToUpload) {
  const uiOptions = {
    fileUploadUrl: `${
      environment.API_URL
    }/simple_forms_api/v1/scanned_form_upload`,
    fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
    maxSize: MAX_FILE_SIZE_BYTES,
    createPayload,
    parseResponse,
  };

  return dispatch => {
    const uploadRequest = uploadFile(
      fileToUpload,
      uiOptions,
      () => {}, // onProgress
      () => {}, // onChange
      () => {}, // onError
    );
    uploadRequest(dispatch, () => ({
      form: {
        formId: formNumber,
      },
    }));
  };
}
