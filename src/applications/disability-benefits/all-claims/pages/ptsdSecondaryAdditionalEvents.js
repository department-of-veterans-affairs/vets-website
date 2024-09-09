import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { additionalEvents } from '../content/ptsdAdditionalEvents';

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': additionalEvents,
  [`view:enterAdditionalSecondaryEvents${index}`]: yesNoUI({
    title: 'Would you like to tell us about another event?',
  }),
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`view:enterAdditionalSecondaryEvents${index}`]: yesNoSchema,
  },
});
