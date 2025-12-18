import React from 'react';
import { fileInputMultipleSchema } from '~/platform/forms-system/src/js/web-component-patterns';
import { burialUploadUI } from '../../../utils/upload';
import { validateFileUploads } from '../../../utils/validation';

import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Transportation costs'),
    'ui:description': (
      <>
        <p>
          Upload an itemized receipt for any costs you paid for transporting the
          Veteran’s remains.
        </p>
        <p>
          <strong>Here’s what the itemized receipt should include:</strong>
        </p>
        <ul>
          <li>The deceased Veteran’s name</li>
          <li>The transportation costs</li>
          <li>Date of the transportation service</li>
          <li>Name of the person who paid the transportation costs</li>
        </ul>
        <p>
          <strong>How to upload files</strong>
        </p>
        <ul>
          <li>Format the file as a .jpg, .pdf, or .png file</li>
          <li>Be sure that your file size is 20mb or less</li>
        </ul>
      </>
    ),
    transportationReceipts: {
      ...burialUploadUI({ title: 'Upload an itemized receipt' }),
      'ui:validations': [validateFileUploads()],
    },
  },
  schema: {
    type: 'object',
    properties: {
      transportationReceipts: fileInputMultipleSchema(),
    },
  },
};
