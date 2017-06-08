import _ from 'lodash/fp';

import FileField from '../FileField';
import { validateFileField } from '../validation';

const defaults = {
  fileTypes: ['pdf', 'txt', 'jpg', 'jpeg', 'gif'],
  maxSize: 26214400,
  endpoint: '/v0/uploads'
};

export default function fileUiSchema(label, userOptions = {}) {
  const options = _.assign(defaults, userOptions);
  return {
    'ui:title': label,
    'ui:field': FileField,
    'ui:options': {
      endpoint: options.endpoint,
      fileTypes: options.fileTypes,
      maxSize: options.maxSize,
      showFieldLabel: true
    },
    'ui:errorMessages': {
      required: 'You must upload a file',
      minItems: 'You must upload a file'
    },
    'ui:validations': [
      validateFileField
    ]
  };
}

// An example schema so we don't forget it for now
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
