import React from 'react';
import { confirmDescription } from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': (
    <h3 className="vads-u-font-size--h4 vads-u-margin--0">
      Toxic Exposure Confirmation
    </h3>
  ),
  'ui:description': confirmDescription,
  'view:exposureStatus': {
    'ui:title':
      'Do you think your condition could be connected to a toxic exposure?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['view:exposureStatus'],
  properties: {
    'view:exposureStatus': {
      type: 'boolean',
    },
  },
};
