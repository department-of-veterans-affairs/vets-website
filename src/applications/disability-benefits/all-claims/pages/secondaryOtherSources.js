import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import {
  otherSourcesDescription,
  otherSourcesHelpText,
} from '../content/secondaryOtherSources';

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': otherSourcesDescription,
  [`secondaryIncident${index}`]: {
    otherSources: yesNoUI({
      title: 'Would you like us to help you gather this information?',
      options: {
        labels: {
          Y: 'Yes, I’d like help getting supporting evidence and information.',
          N: 'No, I don’t need help with this.',
        },
      },
    }),
  },
  'view:otherSourcesHelp': {
    'ui:description': otherSourcesHelpText,
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        otherSources: yesNoSchema,
      },
    },
    'view:otherSourcesHelp': {
      type: 'object',
      properties: {},
    },
  },
});
