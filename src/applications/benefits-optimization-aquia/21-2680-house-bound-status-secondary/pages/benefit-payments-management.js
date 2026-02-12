/**
 * @module pages/benefit-payments-management
 * @description Standard form system configuration for Benefit Payments Management page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects whether the patient has mental capacity to manage benefit payments,
 * with a conditionally revealed explanation textarea when "No" is selected.
 */

import {
  yesNoUI,
  yesNoSchema,
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** Textarea config revealed when "No" is selected */
const benefitPaymentsTextarea = textareaUI({
  title:
    'If no, provide the disability(ies) that prevent them from performing this function and any rationale to support your conclusion',
});

/**
 * uiSchema for Benefit Payments Management page
 * Yes/No radio with textarea conditionally revealed on "No"
 */
export const benefitPaymentsManagementUiSchema = {
  ...titleUI('Benefit payments management'),
  hasMentalCapacity: yesNoUI({
    title:
      'In your judgment, does the patient have the mental capacity to manage their benefit payments, or are they able to direct someone to do so?',
    required: () => true,
    errorMessages: {
      required: 'Please select yes or no',
    },
  }),
  mentalCapacityExplanation: {
    ...benefitPaymentsTextarea,
    'ui:options': {
      ...benefitPaymentsTextarea['ui:options'],
      expandUnder: 'hasMentalCapacity',
      expandUnderCondition: value => value === false,
      expandedContentFocus: true,
    },
  },
};

/**
 * JSON Schema for Benefit Payments Management page
 * Validates mental capacity selection and optional explanation
 */
export const benefitPaymentsManagementSchema = {
  type: 'object',
  required: ['hasMentalCapacity'],
  properties: {
    hasMentalCapacity: yesNoSchema,
    mentalCapacityExplanation: { type: 'string' },
  },
};
