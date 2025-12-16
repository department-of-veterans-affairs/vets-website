import React from 'react';
import { fileInputMultipleSchema } from '~/platform/forms-system/src/js/web-component-patterns';
import { burialUploadUI } from '../../../utils/upload';
import { generateTitle } from '../../../utils/helpers';

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
    militarySeparationDocuments: {
      ...burialUploadUI('Upload DD214 or other separation documents'),
      'ui:validations': [
        // Temporary workaround to enforce required file until bug is fixed
        // https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/4716
        (errors, fieldData) => {
          const file = fieldData[0] || {};
          if (file?.isEncrypted && !file?.confirmationCode) {
            return;
          }

          if (!file || !file.name) {
            errors.addError('Upload a supporting document');
          }
        },
      ],
    },
  },
  schema: {
    type: 'object',
    required: ['militarySeparationDocuments'],
    properties: {
      militarySeparationDocuments: fileInputMultipleSchema(),
    },
  },
};
