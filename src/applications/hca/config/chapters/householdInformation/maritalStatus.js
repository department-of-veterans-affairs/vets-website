// @ts-check
import {
  titleUI,
  descriptionUI,
  selectUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MaritalStatusDescription } from '../../../components/FormDescriptions';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { maritalStatus } = FULL_SCHEMA.definitions;

export default {
  uiSchema: {
    ...titleUI(content['household-info--marital-status-title']),
    ...descriptionUI(MaritalStatusDescription),
    maritalStatus: {
      ...selectUI({
        title: content['household-info--marital-status-label'],
        reviewField: CustomReviewField,
      }),
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
