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
      classNames: 'custom-hide-label',
      useFormsPattern: 'single',
      formHeading: content['military-service-operations-description'],
      formDescription: CombatOperationServiceDescription,
      formHeadingLevel: 5,
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
