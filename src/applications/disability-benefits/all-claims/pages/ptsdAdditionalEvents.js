import { ptsd781NameTitle } from '../content/ptsdClassification';
import { additionalEvents } from '../content/ptsdAdditionalEvents';

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': additionalEvents,
  [`view:doneEnteringIncidents${index}`]: {
    'ui:title': 'Do you have another event or situation to tell us about?',
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
