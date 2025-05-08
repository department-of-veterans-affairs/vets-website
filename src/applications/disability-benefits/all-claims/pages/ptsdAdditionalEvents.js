import {
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { ptsd781NameTitle } from '../content/ptsdClassification';
import { additionalEvents } from '../content/ptsdAdditionalEvents';

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': additionalEvents,
  [`view:enterAdditionalEvents${index}`]: yesNoUI({
    title: 'Do you have another event or situation to tell us about?',
  }),
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`view:enterAdditionalEvents${index}`]: yesNoSchema,
  },
});
