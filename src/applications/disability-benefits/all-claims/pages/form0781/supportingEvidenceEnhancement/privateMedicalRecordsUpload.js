import _ from 'platform/utilities/data';
import { ancillaryFormUploadUi } from '../../../utils/schemas';
import { DATA_PATHS } from '../../../constants';
import { standardTitle } from '../../../content/form0781';
import {
  pmrTitle,
  pmrDescription,
} from '../../../content/form0781/supportingEvidenceEnhancement/privateMedicalRecordsUpload';

const fileUploadUi = ancillaryFormUploadUi('', '', {
  attachmentId: '',
  addAnotherLabel: 'Add another file',
  buttonText: 'Upload file',
});

export const uiSchema = {
  'ui:title': standardTitle(pmrTitle),
  'ui:description': pmrDescription,
  // TODO: replace current V1 upload component to V3 Component
  tempPrivateMedicalRecordAttachments: {
    ...fileUploadUi,
    'ui:options': { ...fileUploadUi['ui:options'] },
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
    tempPrivateMedicalRecordAttachments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {},
      },
    },
  },
};
