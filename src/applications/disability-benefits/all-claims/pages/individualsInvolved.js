import { ptsd781NameTitle } from '../content/ptsdClassification';
import { individualsInvolved } from '../content/individualsInvolved';

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': individualsInvolved,
  [`view:individualsInvolved${index}`]: {
    'ui:title': 'Was anyone else injured or killed during this event?',
    'ui:widget': 'yesNo',
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`view:individualsInvolved${index}`]: {
      type: 'boolean',
    },
  },
});
