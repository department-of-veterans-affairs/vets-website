import { FULL_SCHEMA } from '../../../utils/imports';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import {
  PensionInfoDescription,
  PensionTypeDescription,
} from '../../../components/FormDescriptions';

const { vaPensionType } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    'ui:title': 'Current compensation from VA',
    'ui:description': PensionInfoDescription,
    vaPensionType: {
      'ui:title': 'Do you receive a Veterans pension from the VA?',
      'ui:description': PensionTypeDescription,
      'ui:reviewField': CustomReviewField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          pension: 'Yes',
          none: 'No',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['vaPensionType'],
    properties: { vaPensionType },
  },
};
