import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import { MaritalStatusDescription } from '../../../components/FormDescriptions';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import content from '../../../locales/en/content.json';

const { maritalStatus } = FULL_SCHEMA.definitions;

export default {
  uiSchema: {
    ...titleUI(content['household-info--marital-status-title']),
    ...descriptionUI(MaritalStatusDescription),
    maritalStatus: {
      'ui:title': content['household-info--marital-status-label'],
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
