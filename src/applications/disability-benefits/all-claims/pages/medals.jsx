import React from 'react';

import { ptsd781NameTitle } from '../content/ptsdClassification';
import { MedalsDescription } from '../content/medals';

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': ({ formData }) => (
    <MedalsDescription formData={formData} index={index} />
  ),
  [`incident${index}`]: {
    'view:medals': {
      'ui:title': ' ',
      'ui:widget': 'yesNo',
    },
    medalsCitations: {
      'ui:title': 'Please tell us what medal or citation you received. ',
      'ui:options': {
        expandUnder: 'view:medals',
        expandUnderCondition: true,
      },
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`incident${index}`]: {
      type: 'object',
      properties: {
        'view:medals': {
          type: 'boolean',
          properties: {},
        },
        medalsCitations: {
          type: 'string',
        },
      },
    },
  },
});
