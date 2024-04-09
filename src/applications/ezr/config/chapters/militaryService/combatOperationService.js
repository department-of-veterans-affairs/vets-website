import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import CombatOperationServiceDescription from '../../../components/FormDescriptions/CombatOperationServiceDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    'ui:title': content['military-service-operations-title'],
    combatOperationService: yesNoUI({
      title: content['military-service-operations-description'],
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
