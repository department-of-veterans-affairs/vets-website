import { ptsd781NameTitle } from '../content/ptsdClassification';
import { additionalEvents } from '../content/ptsdAdditionalEvents';

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': additionalEvents,
  [`view:doneEnteringIncidents${index}`]: {
    'ui:title': 'Would you like to tell us about another event?',
    'ui:widget': 'yesNo',
  },
});

export const schema = index => ({
  type: 'object',
  required: [`view:doneEnteringIncidents${index}`],
  properties: {
    [`view:doneEnteringIncidents${index}`]: {
      type: 'boolean',
    },
  },
});
