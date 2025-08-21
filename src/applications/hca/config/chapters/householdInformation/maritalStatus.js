import { FULL_SCHEMA } from '../../../utils/imports';
import { MaritalStatusDescription } from '../../../components/FormDescriptions';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';

const { maritalStatus } = FULL_SCHEMA.definitions;

export default {
  uiSchema: {
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
