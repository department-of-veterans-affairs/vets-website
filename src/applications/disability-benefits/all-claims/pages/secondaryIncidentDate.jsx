import React from 'react';
import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { SecondaryDateDescription } from '../content/incidentDate';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const {
  incidentDate,
} = fullSchema.definitions.secondaryPtsdIncident.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': () => <SecondaryDateDescription index={index} />,
  [`secondaryIncident${index}`]: {
    incidentDate: currentOrPastDateUI(' '),
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: { incidentDate },
    },
  },
});
