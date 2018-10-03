import fileUploadUI from 'us-forms-system/lib/js/definitions/file';
import environment from '../../../../platform/utilities/environment';
import { additionalDocumentDescription } from '../content/additionalDocuments';
import { FIFTY_MB } from '../constants';

import full526EZSchema from '../config/schema.js';

const { attachments } = full526EZSchema.properties;

export const uiSchema = {
  additionalDocuments: Object.assign(
    {},
    fileUploadUI('Lay statements or other evidence', {
      itemDescription: 'Adding additional evidence:',
      fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
      buttonText: 'Upload Document',
      addAnotherLabel: 'Add Another Document',
      fileTypes: [
        'pdf',
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'tif',
        'tiff',
        'txt',
      ],
      maxSize: FIFTY_MB,
      createPayload: file => {
        const payload = new FormData();
        payload.append('supporting_evidence_attachment[file_data]', file);

        return payload;
      },
      parseResponse: (response, file) => ({
        name: file.name,
        confirmationCode: response.data.attributes.guid,
      }),
      // this is the uiSchema passed to FileField for the attachmentId schema
      // FileField requires this name be used
      attachmentSchema: {
        'ui:title': 'Document type',
      },
      // this is the uiSchema passed to FileField for the name schema
      // FileField requires this name be used
      attachmentName: {
        'ui:title': 'Document name',
      },
    }),
    { 'ui:description': additionalDocumentDescription },
  ),
};

export const schema = {
  type: 'object',
  required: ['additionalDocuments'],
  properties: {
    additionalDocuments: attachments,
  },
};
