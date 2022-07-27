import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { UploadDescription } from '../content/evidencePrivateUpload';
import { ancillaryFormUploadUi } from '../utils/upload';
import { hasPrivateEvidenceToUpload } from '../utils/helpers';

const { privateMedicalRecordAttachments } = fullSchema.properties;

const fileUploadUi = ancillaryFormUploadUi(
  'Upload your private medical records',
  ' ',
  {
    attachmentId: '',
    addAnotherLabel: 'Add another document',
  },
);

export default {
  uiSchema: {
    privateMedicalRecordAttachments: {
      ...fileUploadUi,
      'ui:options': {
        ...fileUploadUi['ui:options'],
      },
      'ui:description': UploadDescription,
      'ui:required': hasPrivateEvidenceToUpload,
    },
  },

  schema: {
    type: 'object',
    properties: {
      privateMedicalRecordAttachments,
    },
  },
};
