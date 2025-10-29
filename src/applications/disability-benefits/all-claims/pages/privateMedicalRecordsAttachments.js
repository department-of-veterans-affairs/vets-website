import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import _ from 'platform/utilities/data';

import { UploadDescription } from '../content/fileUploadDescriptions';
import { ancillaryFormUploadUi } from '../utils/schemas';
import { DATA_PATHS } from '../constants';

const { privateMedicalRecordAttachments } = fullSchema.properties;

const fileUploadUi = ancillaryFormUploadUi(
  'Upload your private medical records',
  ' ',
  {
    attachmentId: '',
    addAnotherLabel: 'Add another file',
    buttonText: 'Upload file',
  },
);

export const uiSchema = {
  privateMedicalRecordAttachments: {
    ...fileUploadUi,
    'ui:options': { ...fileUploadUi['ui:options'] },
    'ui:description': UploadDescription,
    'ui:confirmationField': ({ formData }) => ({
      data: formData?.map(item => item.name || item.fileName),
      label: 'Private medical records',
    }),
    'ui:required': data =>
      _.get(DATA_PATHS.hasPrivateRecordsToUpload, data, false),
  },
};

export const schema = {
  type: 'object',
  properties: {
    privateMedicalRecordAttachments,
  },
};
