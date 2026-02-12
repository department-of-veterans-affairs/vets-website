/**
 * @module pages/nursing-home-care
 * @description Standard form system configuration for Nursing Home Care page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects whether the patient requires nursing home care,
 * with a conditionally revealed explanation textarea.
 */

import {
  yesNoUI,
  yesNoSchema,
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** Textarea config for nursing home care explanation */
const nursingHomeCareTextarea = textareaUI({
  title: 'If yes, provide explanation',
});

/**
 * uiSchema for Nursing Home Care page
 * Yes/No radio with conditionally revealed textarea
 */
export const nursingHomeCareUiSchema = {
  ...titleUI('Nursing home care'),
  requiresNursingHomeCare: yesNoUI({
    title: 'Does the patient require nursing home care?',
    required: () => true,
    errorMessages: {
      required: 'Please select yes or no',
    },
  }),
  nursingHomeCareExplanation: {
    ...nursingHomeCareTextarea,
    'ui:options': {
      ...nursingHomeCareTextarea['ui:options'],
      expandUnder: 'requiresNursingHomeCare',
      expandUnderCondition: true,
      expandedContentFocus: true,
    },
  },
};

/**
 * JSON Schema for Nursing Home Care page
 * Validates nursing home care selection and optional explanation
 */
export const nursingHomeCareSchema = {
  type: 'object',
  required: ['requiresNursingHomeCare'],
  properties: {
    requiresNursingHomeCare: yesNoSchema,
    nursingHomeCareExplanation: { type: 'string' },
  },
};
