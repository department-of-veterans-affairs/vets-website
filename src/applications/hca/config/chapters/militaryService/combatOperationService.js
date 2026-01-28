// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import CombatOperationServiceDescription from '../../../components/FormDescriptions/CombatOperationServiceDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['service-info--operations-title']),
    combatOperationService: yesNoUI({
      title: content['service-info--operations-label'],
      description: CombatOperationServiceDescription,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      combatOperationService: yesNoSchema,
    },
  },
};
