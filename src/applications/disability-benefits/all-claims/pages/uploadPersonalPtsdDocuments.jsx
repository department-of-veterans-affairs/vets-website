import React from 'react';

import { DocumentDescription } from '../content/uploadPtsdDocuments';
import { PtsdNameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi } from '../utils';

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': DocumentDescription,
  ptsd781a: ancillaryFormUploadUi('PTSD 781a form'),
};

export const schema = {
  type: 'object',
  required: ['ptsd781a'],
  properties: {
    ptsd781a: {
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
