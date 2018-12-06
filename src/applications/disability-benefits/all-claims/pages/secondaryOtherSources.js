import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';
import {
  otherSourcesDescription,
  otherSourcesHelpText,
} from '../content/secondaryOtherSources';

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': otherSourcesDescription,
  [`otherSources${index}`]: {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        yes: 'Yes, I’d like help getting supporting evidence and information',
        no: 'No, I don’t need help with this.',
      },
    },
  },
  'view:otherSourcesHelp': {
    'ui:description': otherSourcesHelpText,
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`otherSources${index}`]: {
      type: 'string',
      enum: ['yes', 'no'],
    },
    'view:otherSourcesHelp': {
      type: 'object',
      properties: {},
    },
  },
});
