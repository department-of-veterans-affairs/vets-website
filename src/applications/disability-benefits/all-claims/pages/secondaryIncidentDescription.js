import React from 'react';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { ptsd781aNameTitle } from '../content/ptsdClassification';

const incidentDescriptionInstructions = (
  <div>
    <h3>Event description</h3>
    <p>Please tell us where this event happened. Be as specific as you can.</p>
  </div>
);

const { description } = fullSchema.definitions.secondaryPtsdIncident.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': incidentDescriptionInstructions,
  [`secondaryIncident${index}`]: {
    description: {
      'ui:title': ' ',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 32000,
      },
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        description,
      },
    },
  },
});
