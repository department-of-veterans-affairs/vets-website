import {
  UploadDetails,
  evidenceOtherText,
} from '../../content/evidence/uploadDetails';
import { fileUploadUi } from '../../utils/upload';
import { ATTACHMENTS_OTHER } from '../../constants';

export default {
  uiSchema: {
    additionalDocuments: {
      ...fileUploadUi(evidenceOtherText),
      'ui:description': UploadDetails,
    },
  },

  schema: {
    type: 'object',
    required: ['additionalDocuments'],
    properties: {
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
