import environment from 'platform/utilities/environment';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';
import SupportingDocumentsDescription from '../../../components/FormDescriptions/SupportingDocumentsDescription';
import content from '../../../locales/en/content.json';
import { ezrAttachmentsSchema } from '../../../definitions/attachments';
import {
  createPayload,
  parseResponse,
} from '../../../utils/helpers/file-attachments';

export default {
  uiSchema: {
    'ui:title': content['military-service-supporting-documents-title'],
    'ui:description': SupportingDocumentsDescription,
    attachments: fileUploadUI('', {
      buttonText: 'Upload a document',
      addAnotherLabel: 'Upload another document',
      fileUploadUrl: `${environment.API_URL}/v0/form1010_ezr_attachments`,
      fileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'rtf'],
      maxSize: 1024 * 1024 * 10, // 10 MB max size
      hideLabelText: true,
      createPayload,
      parseResponse,
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
