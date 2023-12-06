import React from 'react';
import {
  introDescription,
  introQuestion,
  moreInfoDescription,
} from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': (
    <h3 className="vads-u-font-size--h4 vads-u-margin--0">Toxic Exposure</h3>
  ),
  'view:exposureStatus': {
    'ui:title': introQuestion,
    'ui:description': introDescription,
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        yes: 'Yes',
        no: 'No',
      },
    },
  },
  'view:moreExposureInfo': {
    'ui:description': moreInfoDescription,
  },
};

export const schema = {
  type: 'object',
  required: ['view:exposureStatus'],
  properties: {
    'view:exposureStatus': {
      type: 'string',
      enum: ['yes', 'no'],
    },
    'view:moreExposureInfo': {
      type: 'object',
      properties: {},
    },
  },
};
