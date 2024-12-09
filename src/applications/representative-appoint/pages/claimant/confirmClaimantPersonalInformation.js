import React from 'react';
import VeteranDetails from '../../components/VeteranDetails';

/** @type {PageSchema} */

export const uiSchema = {
  'ui:title': 'Confirm the personal information we have on file for you',
  'ui:description': <VeteranDetails />,
  'view:confirmVeteranPersonalInformation': {
    'ui:options': {
      displayEmptyObjectOnReview: true,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    'view:confirmVeteranPersonalInformation': {
      type: 'object',
      properties: {},
    },
  },
};
