import {
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  reassignmentPageTitle,
  behaviorDescriptionPageDescription,
} from '../../../content/form0781/behaviorListPages';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../../content/form0781';

export const uiSchema = {
  'ui:title': titleWithTag(reassignmentPageTitle, form0781HeadingTag),
  behaviorsDetails: {
    reassignment: textareaUI({
      title: behaviorDescriptionPageDescription,
    }),
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
        reassignment: textareaSchema,
      },
    },
    'view:mentalHealthSupportAlert': {
      type: 'object',
      properties: {},
    },
  },
};
