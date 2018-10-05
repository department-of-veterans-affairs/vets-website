import React from 'react';
import { PtsdNameTitle, stressfullIncidentDescriptionTitle } from '../helpers';

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': stressfullIncidentDescriptionTitle,
  secondaryIncidentDescription: {
    'ui:title':
      'Please tell us what happened during the event or situation. The information you give us here will help us research your claim. Provide the level of detail that you‘re comfortable sharing. You don‘t have to repeat any information that you‘ve already shared.',
    'ui:widget': 'textarea',
  },
};

export const schema = {
  type: 'object',
  properties: {
    secondaryIncidentDescription: {
      type: 'string',
    },
  },
};
