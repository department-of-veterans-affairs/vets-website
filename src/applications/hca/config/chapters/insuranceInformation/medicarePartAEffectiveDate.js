import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  MedicareClaimNumberDescription,
  MedicareEffectiveDateDescription,
} from '../../../components/FormDescriptions';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import CustomDateReviewField from '../../../components/FormReview/CustomDateReviewField';

const {
  medicareClaimNumber,
  medicarePartAEffectiveDate,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    medicarePartAEffectiveDate: {
      ...currentOrPastDateUI('What is your Medicare Part A effective date?'),
      'ui:description': MedicareEffectiveDateDescription,
      'ui:reviewField': CustomDateReviewField,
      'ui:required': () => true,
    },
    medicareClaimNumber: {
      'ui:title': 'What is your Medicare claim number?',
      'ui:description': MedicareClaimNumberDescription,
      'ui:reviewField': CustomReviewField,
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter a valid 11-character Medicare claim number',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      medicarePartAEffectiveDate,
      medicareClaimNumber,
    },
  },
};
