import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

const { medicarePartAEffectiveDate } = fullSchemaHca.properties;

export default {
  uiSchema: {
    medicarePartAEffectiveDate: currentOrPastDateUI(
      'What is your Medicare Part A effective date?',
    ),
  },
  schema: {
    type: 'object',
    required: ['medicarePartAEffectiveDate'],
    properties: {
      medicarePartAEffectiveDate,
    },
  },
};
