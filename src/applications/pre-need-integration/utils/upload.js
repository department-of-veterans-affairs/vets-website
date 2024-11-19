import environment from '~/platform/utilities/environment';
import fileUiSchema from '~/platform/forms-system/src/js/definitions/file';
import VaSelectField from '~/platform/forms-system/src/js/web-component-fields/VaSelectField';

import { createPayload, parseResponse } from './helpers';

export const UPLOADING_FILE = 'Uploading file...';
export const NOT_UPLOADED = 'We couldn’t upload your file';
export const MISSING_PASSWORD_ERROR = 'Missing password';
export const UNSUPPORTED_ENCRYPTED_FILE_ERROR =
  "We weren't able to upload your file. Make sure the file is not encrypted and an accepted format.";
export function getFileError(file) {
  if (file.errorMessage) {
    return file.errorMessage;
  }
  if (file.uploading) {
    return UPLOADING_FILE;
  }
  // Awaiting password entry, but we need to set an error so that using the form
  // continue button blocks progression through the form; look in FileField code
  // to see that we prevent error message rendering for this particular error
  if (file.isEncrypted && !file.confirmationCode && !file.password) {
    return MISSING_PASSWORD_ERROR;
  }
  if (!file.confirmationCode) {
    return NOT_UPLOADED;
  }

  return null;
}

export async function validateFile(errors, fileList) {
  // console.log('Hell yeah. \nErrors: ', errors, '\nFileList: ', fileList);
  await Promise.all(
    fileList.map(async (file, index) => {
      const error = getFileError(file);

      if (error && !errors[index]) {
        /* eslint-disable no-param-reassign */
        errors[index] = {
          __errors: [],
          addError(msg) {
            this.__errors.push(msg);
          },
        };
        /* eslint-enable no-param-reassign */
      }

      if (error) {
        errors[index].addError(error);
      } else {
        // Perform server-side validation
        try {
          const API_KEY = '3rJVnS49VTHsntVg3m9L9IrGhhbmX7BN';
          const response = await fetch(
            'https://sandbox-api.va.gov/services/vba_documents/v1/uploads/validate_document',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/pdf',
                apikey: API_KEY,
              },
              body: file,
            },
          );
          if (!response.ok) {
            if (response.status === 422) {
              const data = await response.json();
              errors[index].addError(
                `Server validation error: ${data.errors[0].detail}`,
              );
            } else {
              errors[index].addError('File validation failed on the server.');
            }
          }
        } catch (err) {
          errors[index].addError(
            'An unexpected error occurred during file validation.',
          );
        }
      }
    }),
  );
}

export function fileUploadUi(content) {
  return {
    ...fileUiSchema(content.label, {
      buttonText: 'Upload file',
      addAnotherLabel: 'Upload another file',
      itemDescription: content.description,
      fileUploadUrl: `${
        environment.API_URL
      }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
      fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 1024 * 1024 * 100, // 100 MB max size,
      minSize: 1024,
      createPayload,
      parseResponse,
      attachmentSchema: ({ fileName }) => ({
        'ui:title': 'What kind of file is this?',
        'ui:disabled': false,
        'ui:webComponentField': VaSelectField,
        'ui:options': {
          messageAriaDescribedby: `Choose a document type for ${fileName}`,
        },
      }),
      hideLabelText: !content.label,
      hideOnReview: false,
      attachmentName: {
        'ui:title': 'File name',
      },
    }),
    'ui:description': content.description,
    'ui:validations': [validateFile],
  };
}
