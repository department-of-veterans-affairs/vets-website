import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ptsd781NameTitle } from '../content/ptsdClassification';
import { individualsInvolved } from '../content/individualsInvolved';

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': individualsInvolved,
  [`view:individualsInvolved${index}`]: yesNoUI({
    title: 'Was anyone else injured or killed during this event?',
  }),
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`view:individualsInvolved${index}`]: yesNoSchema,
  },
});
