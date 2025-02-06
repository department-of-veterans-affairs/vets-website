import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';
import { behaviorSummaryPageTitle } from '../../content/form0781/behaviorListPages';

export const uiSchema = {
  'ui:title': titleWithTag(behaviorSummaryPageTitle, form0781HeadingTag),
  'view:mentalHealthSupportAlert': {
    'ui:description': mentalHealthSupportAlert,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:mentalHealthSupportAlert': {
      type: 'object',
      properties: {},
    },
  },
};
