import React from 'react';
import {
  fileInputMultipleSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { burialUploadUI } from '../../../utils/upload';
import { validateFileUploads } from '../../../utils/validation';

export default {
  uiSchema: {
    ...titleUI('DD214 or other separation documents'),
    'ui:description': (
      <p>
        Upload a copy of the Veteran’s DD214 or other separation documents
        including all their service periods.
      </p>
    ),
    militarySeparationDocuments: {
      ...burialUploadUI({
        title: 'Upload DD214 or other separation documents',
      }),
      'ui:validations': [validateFileUploads()],
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
