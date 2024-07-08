import {
  fileInputUI,
  fileInputSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { UPLOAD_GUIDELINES } from '../config/constants';

export const uploadPage = {
  uiSchema: {
    'view:uploadGuidelines': {
      'ui:description': UPLOAD_GUIDELINES,
    },
    uploadedFile: {
      ...fileInputUI({
        title: 'Upload VA Form 21-0779',
        errorMessages: {
          required: 'Upload a completed VA Form 21-0779',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:uploadGuidelines': {
        type: 'object',
        properties: {},
      },
      uploadedFile: fileInputSchema,
    },
    required: ['uploadedFile'],
  },
};
