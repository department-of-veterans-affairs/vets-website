import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { BEHAVIOR_INTRO_COMBAT_DESCRIPTION } from '../../content/form0781/behaviorListPages';

export const uiSchema = {
  'ui:description': BEHAVIOR_INTRO_COMBAT_DESCRIPTION,
  'view:answerCombatBehaviorQuestions': {
    ...radioUI({
      title: 'Do you want to answer additional questions?',
      required: () => true,
      labels: {
        true: 'true',
        false: 'false',
      },
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:answerCombatBehaviorQuestions': radioSchema(['true', 'false']),
  },
};
