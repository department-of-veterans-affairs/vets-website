import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ptsdDateDescription } from '../content/incidentDate';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { incidentDate } = fullSchema.definitions.ptsdIncident.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  [`incident${index}`]: {
    'ui:description': ptsdDateDescription,
    incidentDate: currentOrPastDateUI(' '),
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`incident${index}`]: {
      type: 'object',
      properties: { incidentDate },
    },
  },
});
