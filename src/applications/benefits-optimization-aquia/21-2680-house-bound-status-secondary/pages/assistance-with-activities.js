/**
 * @module pages/assistance-with-activities
 * @description Standard form system configuration for Assistance with Activities page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects information about activities the patient requires assistance with.
 * The "Additional activities" checkbox conditionally reveals a textarea.
 */

import {
  checkboxGroupUI,
  checkboxGroupSchema,
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** Labels for the assistance activities checkbox group */
const assistanceLabels = {
  bathing: 'Bathing / showering',
  eating: 'Eating or self-feeding',
  dressing: 'Dressing',
  ambulating: 'Ambulating within the home or living area',
  hygiene: 'Tending to hygiene needs',
  transferring: 'Transferring in or out of bed / chair',
  toileting: 'Toileting',
  medicationManagement: 'Medication management',
  additionalActivities:
    'Additional activities (i.e., housekeeping, laundering, meal preparation, etc.)',
};

/** Textarea config for specifying additional activities */
const additionalActivityTextarea = textareaUI({
  title: 'Specify additional activity below',
});

/**
 * uiSchema for Assistance with Activities page
 * Checkbox group with conditionally revealed textarea for additional activities
 */
export const assistanceWithActivitiesUiSchema = {
  ...titleUI('Assistance with activities'),
  assistanceActivities: checkboxGroupUI({
    title:
      'Does the patient require assistance with any of the following activities?',
    hint: 'Select ALL that apply.',
    required: true,
    labels: assistanceLabels,
  }),
  additionalActivitiesSpecify: {
    ...additionalActivityTextarea,
    'ui:options': {
      ...additionalActivityTextarea['ui:options'],
      expandUnder: 'assistanceActivities',
      expandUnderCondition: formData => formData?.additionalActivities,
      expandedContentFocus: true,
    },
  },
};

/**
 * JSON Schema for Assistance with Activities page
 * Validates checkbox group selections and optional additional activity text
 */
export const assistanceWithActivitiesSchema = {
  type: 'object',
  required: ['assistanceActivities'],
  properties: {
    assistanceActivities: checkboxGroupSchema([
      'bathing',
      'eating',
      'dressing',
      'ambulating',
      'hygiene',
      'transferring',
      'toileting',
      'medicationManagement',
      'additionalActivities',
    ]),
    additionalActivitiesSpecify: { type: 'string' },
  },
};
