import _ from 'platform/utilities/data';
import { validateFileField } from 'platform/forms-system/src/js/validation';

import { ancillaryFormUploadUi } from '../utils/schemas';
import { UploadDescription } from '../content/fileUploadDescriptions';

const fileUploadUi = ancillaryFormUploadUi(
  'Upload your service treatment records',
  '',
  {
    attachmentId: '',
    addAnotherLabel: 'Add another file',
    buttonText: 'Upload file',
  },
);

export const uiSchema = {
  // 'view:uploadServiceTreatmentRecordsQualifier'
  serviceTreatmentRecordsAttachments: {
    ...fileUploadUi,
    'ui:options': { ...fileUploadUi['ui:options'] },
    'ui:description': UploadDescription,
    'ui:confirmationField': ({ formData }) => ({
      data: formData?.map(item => item.name || item.fileName),
      label: 'Uploaded file(s)',
    }),
    'ui:required': data =>
      _.get(
        'view:uploadServiceTreatmentRecordsQualifier.view:hasServiceTreatmentRecordsToUpload',
        data,
        false,
      ),
    'ui:validations': [validateFileField],
  },
};

export const schema = {
  type: 'object',
  properties: {
    serviceTreatmentRecordsAttachments: {
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
            enum: ['L450', 'L451'],
            enumNames: [
              'STR - Dental - Photocopy',
              'STR - Medical - Photocopy',
            ],
          },
        },
      },
    },
  },
};
