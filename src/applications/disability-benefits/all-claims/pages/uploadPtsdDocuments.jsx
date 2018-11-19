import React from 'react';

import { DocumentDescription } from '../content/uploadPtsdDocuments';
import { PtsdNameTitle } from '../content/ptsdClassification';
import { ancillaryFormUploadUi } from '../utils';

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781" />
  ),
  'ui:description': DocumentDescription,
  ptsd781: ancillaryFormUploadUi('PTSD 781 form'),
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
