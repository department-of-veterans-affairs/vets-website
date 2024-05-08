import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import manifest from '../manifest.json';
import { DONE_UPLOADING, SET_UPLOADER, SET_UPLOADING } from './types';

export function submitToSimpleForms(formId, file) {
  let hasError = false;

  return dispatch => {
    dispatch({
      type: SET_UPLOADING,
      uploading: true,
    });
    require.ensure(
      [],
      require => {
        const csrfTokenStored = localStorage.getItem('csrfToken');
        const { FineUploaderBasic } = require('fine-uploader/lib/core');
        const uploader = new FineUploaderBasic({
          request: {
            endpoint: `${
              environment.API_URL
            }/simple_forms_api/v1/scanned_form_upload`,
            inputName: 'file',
            customHeaders: {
              'Source-App-Name': manifest.entryName,
              'X-Key-Inflection': 'camel',
              'X-CSRF-Token': csrfTokenStored,
            },
            params: { formId },
          },
          cors: {
            expected: true,
            sendCredentials: true,
          },
          multiple: false,
          callbacks: {
            onComplete: (id, name, responseJSON) => {
              if (!hasError) {
                dispatch({
                  type: DONE_UPLOADING,
                  confirmationCode:
                    responseJSON?.data?.attributes?.confirmationCode,
                });
              }
            },
            onError: (_id, fileName, _reason, { response, status }) => {
              if (status < 200 || status > 299) {
                hasError = JSON.parse(response || '{}');
                hasError.fileName = fileName;
              }
            },
          },
        });
        dispatch({
          type: SET_UPLOADER,
          uploader,
        });

        uploader.addFiles(file);
      },
      'form-uploader',
    );
  };
}
