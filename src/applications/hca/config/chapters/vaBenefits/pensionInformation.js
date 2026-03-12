// @ts-check
import {
  titleUI,
  descriptionUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import { PensionDescription } from '../../../components/FormDescriptions';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { vaPensionType } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['benefits--pension-title'],
      content['benefits--pension-description'],
    ),
    ...descriptionUI(PensionDescription),
    vaPensionType: {
      ...radioUI({
        title: content['benefits--pension-label'],
        labels: {
          Yes: content['form--default-yes-label'],
          No: content['form--default-no-label'],
        },
      }),
      'ui:reviewField': CustomReviewField,
    },
  },
  schema: {
    type: 'object',
    required: ['vaPensionType'],
    properties: {
      vaPensionType,
    },
  },
};
