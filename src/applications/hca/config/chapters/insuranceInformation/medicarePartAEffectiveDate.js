import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  MedicareClaimNumberDescription,
  MedicareEffectiveDateDescription,
} from '../../../components/FormDescriptions';

const {
  medicareClaimNumber,
  medicarePartAEffectiveDate,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    medicarePartAEffectiveDate: {
      ...currentOrPastDateUI('What is your Medicare Part A effective date?'),
      'ui:description': MedicareEffectiveDateDescription,
    },
    medicareClaimNumber: {
      'ui:title': 'What is your Medicare claim number?',
      'ui:description': MedicareClaimNumberDescription,
      'ui:errorMessages': {
        minLength: 'Please enter a valid 11-character Medicare claim number',
        maxLength: 'Please enter a valid 11-character Medicare claim number',
        required: 'Please enter your Medicare claim number',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['medicarePartAEffectiveDate', 'medicareClaimNumber'],
    properties: {
      medicarePartAEffectiveDate,
      medicareClaimNumber,
    },
  },
};
