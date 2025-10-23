import {
  titleUI,
  descriptionUI,
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
  medicareClaimNumber,
  medicarePartAEffectiveDate,
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
      'ui:title': content['insurance-info--medicare-details-number-label'],
      ...descriptionUI(MedicareClaimNumberDescription),
      'ui:reviewField': CustomReviewField,
      'ui:required': () => true,
      'ui:errorMessages': {
        required: content['validation-error--medicare-number'],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      medicarePartAEffectiveDate,
      medicareClaimNumber,
    },
  },
};
