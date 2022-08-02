import {
  UploadDescription,
  evidencePrivateText,
} from '../content/evidenceUpload';
import { ancillaryFormUploadUi } from '../utils/upload';
import { hasPrivateEvidenceToUpload } from '../utils/helpers';
import { ATTACHMENTS_PRIVATE } from '../constants';

const fileUploadUi = ancillaryFormUploadUi(evidencePrivateText);

export default {
  uiSchema: {
    privateMedicalRecordAttachments: {
      ...fileUploadUi,
      'ui:description': UploadDescription,
      'ui:required': hasPrivateEvidenceToUpload,
    },
  },

  schema: {
    type: 'object',
    properties: {
      privateMedicalRecordAttachments: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name', 'attachmentId'],
          properties: {
            name: {
              type: 'string',
            },
            confirmationCode: {
              type: 'string',
            },
            attachmentId: {
              type: 'string',
              enum: Object.keys(ATTACHMENTS_PRIVATE),
              enumNames: Object.values(ATTACHMENTS_PRIVATE),
            },
          },
        },
      },
    },
  },
};
