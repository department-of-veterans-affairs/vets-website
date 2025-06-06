import {
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  unlistedPageTitle,
  unlistedDescriptionPageDescription,
  behaviorDescriptionPageHint,
} from '../../content/form0781/behaviorListPages';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';

export const uiSchema = {
  'ui:title': titleWithTag(unlistedPageTitle, form0781HeadingTag),
  behaviorsDetails: {
    unlisted: textareaUI({
      title: unlistedDescriptionPageDescription,
      hint: behaviorDescriptionPageHint,
    }),
  },
  'ui:options': {
    // title wrapped in a <fieldset> causes screenreader bug
    forceDivWrapper: true,
  },
  'view:mentalHealthSupportAlert': {
    'ui:description': mentalHealthSupportAlert,
  },
};

export const schema = {
  type: 'object',
  properties: {
    behaviorsDetails: {
      type: 'object',
      properties: {
        unlisted: textareaSchema,
      },
    },
    'view:mentalHealthSupportAlert': {
      type: 'object',
      properties: {},
    },
  },
};
