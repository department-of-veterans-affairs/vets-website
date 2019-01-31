import React from 'react';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { PtsdNameTitle } from '../content/ptsdClassification';

const incidentDescriptionInstructions = <h3>Event description</h3>;

const { incidentDescription } = fullSchema.definitions.ptsdIncident.properties;

export const uiSchema = index => ({
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781" />
  ),
  'ui:description': incidentDescriptionInstructions,
  [`incident${index}`]: {
    incidentDescription: {
      'ui:title':
        'Please tell us what happened during the event or situation. Provide the level of detail that you‘re comfortable sharing. You don‘t have to repeat any information that you‘ve already shared.',
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
    [`incident${index}`]: {
      type: 'object',
      properties: {
        incidentDescription,
      },
    },
  },
});
