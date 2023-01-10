import {
  uploadTitle,
  UploadDescription,
  evidenceOtherText,
} from '../content/evidenceUpload';
import { fileUploadUi } from '../utils/upload';
import { ATTACHMENTS_OTHER } from '../constants';

export default {
  uiSchema: {
    'view:uploadTitle': {
      'ui:title': ' ',
      'ui:description': uploadTitle,
    },
    additionalDocuments: {
      ...fileUploadUi(evidenceOtherText),
      'ui:description': UploadDescription,
    },
  },

  schema: {
    type: 'object',
    required: ['additionalDocuments'],
    properties: {
      'view:uploadTitle': {
        type: 'object',
        properties: {},
      },
      additionalDocuments: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'attachmentId'],
          properties: {
            name: {
              type: 'string',
            },
            attachmentId: {
              type: 'string',
              enum: Object.keys(ATTACHMENTS_OTHER),
              enumNames: Object.values(ATTACHMENTS_OTHER),
            },
          },
        },
      },
    },
  },
};
