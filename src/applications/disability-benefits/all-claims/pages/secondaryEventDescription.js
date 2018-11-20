import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';

const eventDescriptionInstructions = (
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
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': eventDescriptionInstructions,
  [`secondaryEventDescription${index}`]: {
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
    [`secondaryEventDescription${index}`]: {
      type: 'string',
      properties: {},
    },
  },
});
