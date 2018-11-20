import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';

const incidentDescriptionInstructions = (
  <div>
    <h3>Event description</h3>
    <p>
      Please tell us what happened during the event or situation. Provide the
      level of detail that you‘re comfortable sharing. You don‘t have to repeat
      any information that you‘ve already shared.
    </p>
  </div>
);

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781" />
  ),
  'ui:description': incidentDescriptionInstructions,
  [`incidentDescription${index}`]: {
    'ui:title': ' ',
    'ui:widget': 'textarea',
    'ui:options': {
      rows: 5,
      maxLength: 32000,
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`incidentDescription${index}`]: {
      type: 'string',
      properties: {},
    },
  },
});
