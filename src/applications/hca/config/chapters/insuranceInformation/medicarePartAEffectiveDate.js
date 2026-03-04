// @ts-check
import {
  titleUI,
  descriptionUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  MedicareClaimNumberDescription,
  MedicareEffectiveDateDescription,
} from '../../../components/FormDescriptions';
import CustomReviewField from '../../../components/FormReview/CustomReviewField';
import CustomDateReviewField from '../../../components/FormReview/CustomDateReviewField';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const {
  medicarePartAEffectiveDate,
  medicareClaimNumber,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['insurance-info--medicare-details-title']),
    medicarePartAEffectiveDate: {
      ...currentOrPastDateUI(
        content['insurance-info--medicare-details-date-label'],
      ),
      ...descriptionUI(MedicareEffectiveDateDescription),
      'ui:reviewField': CustomDateReviewField,
      'ui:required': () => true,
    },
    medicareClaimNumber: {
      ...textUI({
        title: content['insurance-info--medicare-details-number-label'],
        errorMessages: {
          required: content['validation-error--medicare-number'],
        },
        reviewField: CustomReviewField,
      }),
      ...descriptionUI(MedicareClaimNumberDescription),
    },
  },
  schema: {
    type: 'object',
    required: ['medicareClaimNumber'],
    properties: {
      medicarePartAEffectiveDate,
      medicareClaimNumber,
    },
  },
};
