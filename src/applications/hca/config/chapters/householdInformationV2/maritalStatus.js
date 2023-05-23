import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

import { MaritalStatusV2Description } from '../../../components/FormDescriptions';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';

const { maritalStatus } = fullSchemaHca.definitions;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    maritalStatus: {
      'ui:title': 'What is your marital status?',
      'ui:description': MaritalStatusV2Description,
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
