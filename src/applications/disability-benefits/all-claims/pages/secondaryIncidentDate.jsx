import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { ptsdDateDescription } from '../content/incidentDate';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const {
  incidentDate,
} = fullSchema.definitions.secondaryPtsdIncident.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': ptsdDateDescription,
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
