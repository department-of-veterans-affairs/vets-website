import get from 'platform/utilities/data/get';
import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';

const reasonForCurrentSeparationOptions = {
  MEDICAL_CARE: 'One of us needs medical care in a dedicated facility',
  LOCATION: 'One of us needs to live in a specific work location',
  RELATIONSHIP: 'We’re experiencing relationship differences or problems',
  OTHER: 'Other',
};

export const otherExplanationRequired = form =>
  get(['reasonForCurrentSeparation'], form) === 'OTHER';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Reason for separation',
    reasonForCurrentSeparation: radioUI({
      title: 'What’s the reason you’re separated from your spouse?',
      labels: reasonForCurrentSeparationOptions,
    }),
    otherExplanation: {
      'ui:title': 'Describe the reason for your separation',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'reasonForCurrentSeparation',
        expandUnderCondition: 'OTHER',
      },
      'ui:required': otherExplanationRequired,
    },
  },
  schema: {
    type: 'object',
    required: ['reasonForCurrentSeparation'],
    properties: {
      reasonForCurrentSeparation: radioSchema(
        Object.keys(reasonForCurrentSeparationOptions),
      ),
      otherExplanation: { type: 'string' },
    },
  },
};
