import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530EZ-schema.json';
import { generateTitle } from '../../../utils/helpers';
import { burialUploadUI } from '../../../utils/upload';

const { files } = fullSchemaBurials.definitions;

export default {
  uiSchema: {
    'ui:title': generateTitle('DD214 or other separation documents'),
    'ui:description': (
      <>
        <p>
          Upload a copy of the Veteran’s DD214 or other separation documents
          including all their service periods.
        </p>
        <p>
          <strong>How to upload files</strong>
        </p>
        <ul>
          <li>Format the file as a .jpg, .pdf, or .png file</li>
          <li>Be sure that your file size is 20mb or less</li>
        </ul>
      </>
    ),
    militarySeparationDocuments: burialUploadUI(
      'Upload DD214 or other separation documents',
    ),
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
