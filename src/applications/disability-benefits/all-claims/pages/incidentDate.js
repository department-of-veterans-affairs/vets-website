import currentOrPastDateUI from 'us-forms-system/lib/js/definitions/currentOrPastDate';

import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ptsdDateDescription } from '../content/incidentDate';
import fullSchema from '../config/schema';

const { date } = fullSchema.definitions;

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
      properties: {
        incidentDate: date,
        'view:ptsdDateDescription': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
});
