import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import environment from 'platform/utilities/environment';

import fileUploadUI from 'platform/forms-system/src/js/definitions/file';

import SupportingDocumentsDescription from '../../components/SupportingDocumentsDescription';

const {
  preneedAttachments,
} = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:description': SupportingDocumentsDescription,
  application: {
    preneedAttachments: fileUploadUI('Select files to upload', {
      addAnotherLabel: 'Add another',
      fileUploadUrl: `${environment.API_URL}/v0/preneeds/preneed_attachments`,
      fileTypes: ['pdf'],
      maxSize: 15728640,
      hideLabelText: true,
      createPayload: file => {
        const payload = new FormData();
        payload.append('preneed_attachment[file_data]', file);

        return payload;
      },
      parseResponse: (response, file) => ({
        name: file.name,
        confirmationCode: response.data.attributes.guid,
      }),
      attachmentSchema: {
        'ui:title': 'What kind of document is this?',
      },
      attachmentName: {
        'ui:title': 'Document name',
      },
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        preneedAttachments,
      },
    },
  },
};
