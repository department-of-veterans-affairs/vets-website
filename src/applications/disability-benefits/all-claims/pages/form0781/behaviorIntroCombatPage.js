import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  titleWithTag,
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../../content/form0781';
import {
  behaviorPageTitle,
  behaviorIntroCombatDescription,
} from '../../content/form0781/behaviorListPages';

export const uiSchema = {
  'ui:title': titleWithTag(behaviorPageTitle, form0781HeadingTag),
  'ui:description': behaviorIntroCombatDescription,
  'view:answerCombatBehaviorQuestions': radioUI({
    title: 'Do you want to answer additional questions?',
    required: () => true,
    labels: {
      true: 'Yes',
      false: 'No',
    },
  }),
  'view:mentalHealthSupportAlert': {
    'ui:description': mentalHealthSupportAlert,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:answerCombatBehaviorQuestions': radioSchema(['true', 'false']),
    'view:mentalHealthSupportAlert': {
      type: 'object',
      properties: {},
    },
  },
};
