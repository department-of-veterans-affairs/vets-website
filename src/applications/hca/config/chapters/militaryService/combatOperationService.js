import { FULL_SCHEMA } from '../../../utils/imports';
import CombatOperationServiceDescription from '../../../components/FormDescriptions/CombatOperationServiceDescription';

const { combatOperationService } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:title': 'Operations',
    combatOperationService: {
      'ui:title': 'Were you deployed in support of any of these operations?',
      'ui:description': CombatOperationServiceDescription,
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    properties: {
      combatOperationService,
    },
  },
};
