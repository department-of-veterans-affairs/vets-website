import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { additionalEvents } from '../content/ptsdAdditionalEvents';

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': additionalEvents,
  [`view:enterAdditionalSecondaryIncidents${index}`]: {
    'ui:title': 'Do you have another event or situation to tell us about?',
    'ui:widget': 'yesNo',
  },
});

export const schema = index => ({
  type: 'object',
  required: [`view:enterAdditionalSecondaryIncidents${index}`],
  properties: {
    [`view:enterAdditionalSecondaryIncidents${index}`]: {
      type: 'boolean',
    },
  },
});
