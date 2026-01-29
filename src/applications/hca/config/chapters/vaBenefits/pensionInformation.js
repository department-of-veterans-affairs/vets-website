// @ts-check
import {
  titleUI,
  descriptionUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import { PensionDescription } from '../../../components/FormDescriptions';
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
          pension: content['form--default-yes-label'],
          none: content['form--default-no-label'],
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
      vaPensionType: radioSchema(vaPensionType.enum),
    },
  },
};
