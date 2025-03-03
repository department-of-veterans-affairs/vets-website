import FileField from 'platform/forms-system/src/js/fields/FileField';
import { createPayload, parseResponse } from './helpers';

/**
 * Clears any validation errors from the file uploads.
 * This prevents error messages from being displayed.
 * There is currently nowhere to submit medallions files.
 */
export function validateFileField(errors, fileList) {
  fileList.forEach((file, index) => {
    // eslint-disable-next-line no-param-reassign
    errors[index] = { __errors: [] };
  });
}

export function fileUploadUi(/* content */) {
  return {
    'ui:field': FileField,
    'ui:options': {
      fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 20971520,
      minSize: 1024,
      createPayload,
      parseResponse,
      addAnotherLabel: 'Add Another',
      showFieldLabel: true,
      keepInPageOnReview: true,
    },
    'ui:errorMessages': {
      required: 'You must upload a file',
      minItems: 'You must upload at least one file',
    },
    'ui:validations': [validateFileField],
  };
}
