import React from 'react';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { ptsd781aNameTitle } from '../content/ptsdClassification';

const incidentDescriptionInstructions = (
  <h3 className="vads-u-font-size--h5">Event description</h3>
);

const { description } = fullSchema.definitions.secondaryPtsdIncident.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': incidentDescriptionInstructions,
  [`secondaryIncident${index}`]: {
    incidentDescription: {
      'ui:title':
        'Please tell us what happened during the event. You don’t have to repeat any information that you’ve already shared in this form. You only need to provide the level of detail that you’re comfortable sharing.',
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
        incidentDescription: description,
      },
    },
  },
});
