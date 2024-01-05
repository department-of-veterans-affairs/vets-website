import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import fileUploadUI from '@department-of-veterans-affairs/platform-forms-system/definitions/file';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import UploadDD214Page from '../../../containers/UploadDD214Page';

const { files } = fullSchemaBurials.definitions;

export default {
  uiSchema: {
    'ui:title': <UploadDD214Page />,
    militarySeparationDocuments: {
      ...fileUploadUI('Upload DD214 or other separation documents', {
        fileUploadUrl: `${environment.API_URL}/v0/claim_attachments`,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['militarySeparationDocuments'],
    properties: {
      militarySeparationDocuments: {
        ...files,
        minItems: 1,
      },
    },
  },
};
