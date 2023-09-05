import React from 'react';
import {
  confirmDescription,
  confirmQuestion,
} from '../../content/toxicExposure';

export const uiSchema = {
  'ui:title': (
    <h3 className="vads-u-font-size--h4 vads-u-margin--0">
      Toxic Exposure Confirmation
    </h3>
  ),
  'ui:description': confirmDescription,
  'view:confirmExposureStatus': {
    'ui:title': confirmQuestion,
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['view:confirmExposureStatus'],
  properties: {
    'view:confirmExposureStatus': {
      type: 'boolean',
    },
  },
};
