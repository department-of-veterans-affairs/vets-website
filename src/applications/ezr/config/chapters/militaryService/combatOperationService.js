import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import CombatOperationServiceDescription from '../../../components/FormDescriptions/CombatOperationServiceDescription';

const { combatOperationService } = ezrSchema.properties;

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
