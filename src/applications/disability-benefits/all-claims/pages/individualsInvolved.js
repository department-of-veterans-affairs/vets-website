import React from 'react';
import { PtsdNameTitle } from '../content/ptsdClassification';
import { individualsInvolved } from '../content/individualsInvolved';

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': individualsInvolved,
  [`view:individualsInvolved${index}`]: {
    'ui:title':
      'Was anyone killed or injured, not including yourself, during this event?',
    'ui:widget': 'yesNo',
    'ui:options': {
      labels: {
        N: 'No, nobody else was injured or killed.',
      },
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`view:individualsInvolved${index}`]: {
      type: 'boolean',
    },
  },
});
