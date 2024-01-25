import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

import { MaritalStatusDescription } from '../../../components/FormDescriptions';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';

const { maritalStatus } = fullSchemaHca.definitions;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    maritalStatus: {
      'ui:title': 'What is your marital status?',
      'ui:description': MaritalStatusDescription,
      'ui:reviewField': CustomReviewField,
    },
  },
  schema: {
    type: 'object',
    required: ['maritalStatus'],
    properties: {
      maritalStatus,
    },
  },
};
