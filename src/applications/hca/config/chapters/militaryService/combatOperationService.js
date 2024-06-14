import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import CombatOperationServiceDescription from '../../../components/FormDescriptions/CombatOperationServiceDescription';

const { combatOperationService } = fullSchemaHca.properties;

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
