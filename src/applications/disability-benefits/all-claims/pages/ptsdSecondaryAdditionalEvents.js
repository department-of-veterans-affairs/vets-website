import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { additionalEvents } from '../content/ptsdAdditionalEvents';

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': additionalEvents,
  [`view:enterAdditionalSecondaryEvents${index}`]: {
    'ui:title': 'Would you like to tell us about another event?',
    'ui:widget': 'yesNo',
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`view:enterAdditionalSecondaryEvents${index}`]: {
      type: 'boolean',
    },
  },
});
