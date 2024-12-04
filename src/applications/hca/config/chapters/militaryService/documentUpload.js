import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import DischargePapersDescription from '../../../components/FormDescriptions/DischargePapersDescription';
import { createPayload, parseResponse } from '../../../utils/helpers';
import { attachmentsSchema } from '../../../definitions/attachments';

export default {
  uiSchema: {
    'ui:title': 'Upload your discharge papers',
    'ui:description': DischargePapersDescription,
    attachments: fileUploadUI('', {
      buttonText: 'Upload a document',
      addAnotherLabel: 'Upload another document',
      fileUploadUrl: `${environment.API_URL}/v0/hca_attachments`,
      fileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'rtf', 'png'],
      maxSize: 1024 * 1024 * 10,
      hideLabelText: true,
      createPayload,
      parseResponse,
      attachmentSchema: {
        'ui:title': 'Document type',
      },
      attachmentName: {
        'ui:title': 'Document name',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      attachments: attachmentsSchema,
    },
  },
};
