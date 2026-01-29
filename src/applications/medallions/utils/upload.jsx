// Keeping this file just in case we need more custom file upload later
// Currently not used because the fileInputUI from platform/forms-system/src/js/web-component-patterns is standard from Platform

import FileField from '../components/FileField';
import { createPayload, parseResponse } from './helpers';

function validImageType(file) {
  const fileType = file.type;
  return (
    fileType === 'image/png' ||
    fileType === 'image/jpg' ||
    fileType === 'image/jpeg'
  );
}

/**
 * Clears any validation errors from the file uploads.
 * This prevents error messages from being displayed.
 * There is currently nowhere to submit medallions files.
 * The validation should probably be redone once connection is set up.
 */
export function validateFileField(errors, fileList) {
  fileList.forEach((file, index) => {
    // eslint-disable-next-line no-param-reassign
    errors[index] = { __errors: [] };
    const fileObject = file.file;
    if (fileObject) {
      if (fileObject.type === 'application/pdf') {
        if (file.size > 99 * 1024 * 1024)
          // eslint-disable-next-line no-param-reassign
          errors[index] = { __errors: [`We couldn't upload your file`] };
      } else if (validImageType(fileObject)) {
        if (file.size > 49 * 1024 * 1024) {
          // eslint-disable-next-line no-param-reassign
          errors[index] = { __errors: [`We couldn't upload your file`] };
        }
      } else {
        // eslint-disable-next-line no-param-reassign
        errors[index] = {
          __errors: [
            `The file extension doesn't match the file format. Please choose a different file.`,
          ],
        };
      }
    }
  });
}

export function fileUploadUi(/* content */) {
  return {
    'ui:title': ' ',
    'ui:field': FileField,
    'ui:options': {
      fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      // maxPdfSize: 99 * 1024 * 1024, /* Fix this when proper validation is implemented */
      // maxSize: 50 * 1024 * 1024, /* Fix this when proper validation is implemented */
      minSize: 1024,
      createPayload,
      parseResponse,
      addAnotherLabel: 'Upload a new file',
      showFieldLabel: true,
      keepInPageOnReview: true,
      allowEncryptedFiles: false,
    },
    'ui:validations': [validateFileField],
  };
}
