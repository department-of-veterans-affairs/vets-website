import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import CombatOperationServiceDescription from '../../../components/FormDescriptions/CombatOperationServiceDescription';
import content from '../../../locales/en/content.json';

const { combatOperationService } = ezrSchema.properties;

export default {
  uiSchema: {
    'ui:title': content['military-service-operations-title'],
    combatOperationService: {
      'ui:title': content['military-service-operations-description'],
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
