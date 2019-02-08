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
  [`secondaryIncident${index}`]: {
    otherSources: {
      'ui:title': 'Would you like us to help you gather this information?',
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          Y: 'Yes, I’d like help getting supporting evidence and information.',
          N: 'No, I don’t need help with this.',
        },
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
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        otherSources: {
          type: 'boolean',
        },
      },
    },
    'view:otherSourcesHelp': {
      type: 'object',
      properties: {},
    },
  },
});
