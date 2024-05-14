import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import CombatOperationServiceDescription from '../../../components/FormDescriptions/CombatOperationServiceDescription';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    'ui:title': content['military-service-operations-title'],
    combatOperationService: radioUI({
      useFormsPattern: 'single',
      title: content['military-service-operations-description'],
      formDescription: CombatOperationServiceDescription,
      labels: {
        '1': 'Yes',
        '2': 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      combatOperationService: radioSchema(['1', '2']),
    },
  },
};
