import fileUploadUI from 'us-forms-system/lib/js/definitions/file';
import environment from '../../../../platform/utilities/environment';

import { DocumentDescription } from '../content/uploadPtsdDocuments';
import { ptsd781NameTitle } from '../content/ptsdClassification';

const FIFTY_MB = 52428800;

export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': DocumentDescription,
  ptsd781: fileUploadUI('', {
    itemDescription: 'PTSD 781 form',
    hideLabelText: true,
    fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
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
};

export const schema = {
  type: 'object',
  required: ['ptsd781'],
  properties: {
    ptsd781: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          size: {
            type: 'integer',
          },
          confirmationCode: {
            type: 'string',
          },
        },
      },
    },
  },
};
