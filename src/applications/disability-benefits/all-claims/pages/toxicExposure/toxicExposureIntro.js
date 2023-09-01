import React from 'react';
import { introQuestion } from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': (
    <h3 className="vads-u-font-size--h4 vads-u-margin--0">Toxic Exposure</h3>
  ),
  'view:toxicExposureStatus': {
    'ui:title': introQuestion,
    'ui:description':
      'Toxic exposures include exposures to substances like Agent Orange, burn pits, radiation, asbestos, or contaminated water.',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        yes: 'Yes',
        no: 'No',
        notSure: 'I’m not sure',
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:toxicExposureStatus'],
  properties: {
    'view:toxicExposureStatus': {
      type: 'string',
      enum: ['yes', 'no', 'notSure'],
    },
  },
};
