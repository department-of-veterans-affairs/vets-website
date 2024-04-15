import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import DischargePapersDescription from '../../../components/FormDescriptions/DischargePapersDescription';
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
      createPayload: file => {
        const payload = new FormData();
        payload.append('hca_attachment[file_data]', file);
        return payload;
      },
      parseResponse: (response, file) => ({
        name: file.name,
        confirmationCode: response.data.attributes.guid,
        size: file.size,
      }),
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
