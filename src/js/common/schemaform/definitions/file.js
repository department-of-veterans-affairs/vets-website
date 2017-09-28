import _ from 'lodash/fp';

import FileField from '../FileField';
import { validateFileField } from '../validation';

export default function fileUiSchema(label, userOptions = {}) {
  return {
    'ui:title': label,
    'ui:field': FileField,
    'ui:options': _.assign({
      fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
      maxSize: 20971520,
      minSize: 1024,
      endpoint: '/v0/claim_attachments',
      addAnotherLabel: 'Add Another',
      showFieldLabel: true,
      keepInPageOnReview: true,
      classNames: 'schemaform-file-upload'
    }, userOptions),
    'ui:errorMessages': {
      required: 'You must upload a file',
      minItems: 'You must upload a file'
    },
    'ui:validations': [
      validateFileField
    ]
  };
}

// An example schema so we don’t forget it for now
export const fileSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string'
      },
      fileSize: {
        type: 'integer'
      },
      confirmationNumber: {
        type: 'string'
      },
      errorMessage: {
        type: 'string'
      },
      uploading: {
        type: 'boolean'
      }
    }
  }
};
