import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  descriptionUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import MedicareClaimNumberDescription from '../../../components/FormDescriptions/MedicareClaimNumberDescription';
import content from '../../../locales/en/content.json';

const { medicareClaimNumber } = ezrSchema.properties;

export default {
  uiSchema: {
    medicarePartAEffectiveDate: currentOrPastDateUI({
      title: content['insurance-medicare-part-a-title'],
      hint: content['insuance-medicare-part-a-hint'],
    }),
    medicareClaimNumber: {
      'ui:title': content['insurance-medicare-claim-number-label'],
      ...descriptionUI(MedicareClaimNumberDescription, { hideOnReview: true }),
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        hint: content['insurance-medicare-claim-number-hint'],
      },
      'ui:errorMessages': {
        required: content['validation-medicare-claim-number'],
      },
    },
  },
  schema: {
    type: 'object',
    required: ['medicarePartAEffectiveDate', 'medicareClaimNumber'],
    properties: {
      medicarePartAEffectiveDate: currentOrPastDateSchema,
      medicareClaimNumber,
    },
  },
};
