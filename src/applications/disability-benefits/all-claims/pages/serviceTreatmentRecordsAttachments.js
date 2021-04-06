import _ from 'platform/utilities/data';
import { validateFileField } from 'platform/forms-system/src/js/validation';

import { ancillaryFormUploadUi } from '../utils';
import { UploadDescription } from '../content/fileUploadDescriptions';

// import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import fullSchema from '../config/schema';

const fileUploadUi = ancillaryFormUploadUi(
  'Upload your service treatment records',
  '',
  {
    attachmentId: '',
    addAnotherLabel: 'Add another document',
  },
);

const { serviceTreatmentRecordsAttachments } = fullSchema.properties;

export const uiSchema = {
  // 'view:uploadServiceTreatmentRecordsQualifier'
  serviceTreatmentRecordsAttachments: {
    ...fileUploadUi,
    'ui:options': {
      ...fileUploadUi['ui:options'],
    },
    'ui:description': UploadDescription,
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
    serviceTreatmentRecordsAttachments,
  },
};
