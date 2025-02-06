import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';
import {
  behaviorPageTitle,
  behaviorIntroDescription,
} from '../../content/form0781/behaviorListPages';

export const uiSchema = {
  'ui:title': titleWithTag(behaviorPageTitle, form0781HeadingTag),
  'ui:description': behaviorIntroDescription,
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
