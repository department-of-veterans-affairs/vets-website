import React from 'react';
import fullSchemaBurials from 'vets-json-schema/dist/21P-530V2-schema.json';
import { generateTitle } from '../../../utils/helpers';
import { burialUploadUI } from '../../../utils/upload';

const { files } = fullSchemaBurials.definitions;

export default {
  uiSchema: {
    'ui:title': generateTitle('DD214 or other separation documents'),
    'ui:description': (
      <>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          Upload a copy of the Veteran’s DD214 or other separation documents
          including all their service periods.
        </p>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          <strong>How to upload files</strong>
        </p>
        <ul className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          <li>Format the file as a .jpg, .pdf, or .png file</li>
          <li>Be sure that your file size is 20mb or less</li>
        </ul>
      </>
    ),
    militarySeparationDocuments: {
      ...burialUploadUI('Upload DD214 or other separation documents'),
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
