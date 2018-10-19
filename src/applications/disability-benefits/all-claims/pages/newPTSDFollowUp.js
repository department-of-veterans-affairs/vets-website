import React from 'react';
import { getDisabilityName } from '../utils';
import { newPTSDFollowUpDescription } from '../content/newPTSDFollowUp';

export const disabilityNameTitle = ({ formData }) => (
  <legend className="schemaform-block-title schemaform-title-underline">
    {getDisabilityName(formData.condition)}
  </legend>
);

export const uiSchema = {
  'ui:title': 'Disability details',
  newDisabilities: {
    items: {
      'ui:title': disabilityNameTitle,
      'ui:description': newPTSDFollowUpDescription,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    newDisabilities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {},
      },
    },
  },
};
