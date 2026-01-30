// @ts-check
import {
  titleUI,
  descriptionUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import { PensionDescription } from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

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
        required: () => true,
      }),
      'ui:reviewField': CustomReviewField,
    },
  },
  schema: {
    type: 'object',
    required: ['vaPensionType'],
    properties: {
      vaPensionType: radioSchema(['Yes', 'No']),
    },
  },
};
