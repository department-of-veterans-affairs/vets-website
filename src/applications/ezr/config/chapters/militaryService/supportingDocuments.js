import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import SupportingDocumentsDescription from '../../../components/FormDescriptions/SupportingDocumentsDescription';
import content from '../../../locales/en/content.json';
import { ezrAttachmentsSchema } from '../../../definitions/attachments';

/** @type {PageSchema} */

export default {
  uiSchema: {
    'ui:title': content['military-service-supporting-documents-title'],
    'ui:description': SupportingDocumentsDescription,
    attachments: fileUploadUI('', {
      buttonText: 'Upload a document',
      addAnotherLabel: 'Upload another document',
      fileUploadUrl: `${environment.API_URL}/v0/hca_attachments`,
      fileTypes: ['jpg', 'png', 'pdf', 'doc', 'rtf'],
      maxSize: 1024 * 1024 * 10, // 10 MB max size
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
      attachments: ezrAttachmentsSchema,
    },
  },
};
