import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { createNewConditionName } from './utils';

export const causeOptions = {
  NEW:
    'An exposure, event, injury, or onset of disease during my military service',
  SECONDARY: 'A service-connected disability or condition I already have',
  WORSENED:
    'An existing condition I had before I served but that worsened because of my service',
  VA: 'An exposure, event, or injury while I was receiving VA care',
};

const allowSecondary = (formData, index) => {
  const ratedCount = Array.isArray(formData?.ratedDisabilities)
    ? formData.ratedDisabilities.length
    : 0;

  // How many NEW conditions are in this claim?
  const newCount = Array.isArray(formData?.newConditions)
    ? formData.newConditions.length
    : 0;

  // Show SECONDARY if:
  //  - the Veteran already has rated disabilities, OR
  //  - we’re on any item AFTER the first new condition in this claim
  //
  // If your forms runtime passes the array item index to updateSchema (many VA pages do),
  // this check makes the intent explicit (index > 0 = not the first condition page).
  if (typeof index === 'number') {
    return ratedCount > 0 || index > 0;
  }

  // Fallback when index isn’t available: show once the claim has >1 new condition
  return ratedCount > 0 || newCount > 1;
};

const allowedCauseValues = (formData, index) => {
  const base = Object.keys(causeOptions);
  return allowSecondary(formData, index)
    ? base
    : base.filter(v => v !== 'SECONDARY');
};

const baseRadioUI = radioUI({
  title: 'What caused your condition?',
  labels: causeOptions,
});

const causePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => createNewConditionName(formData, true),
      undefined,
      false,
    ),

    cause: {
      ...baseRadioUI,
      'ui:options': {
        ...baseRadioUI['ui:options'],
        // Dynamically hide SECONDARY until allowed
        updateSchema: (formData, schema, uiSchema, index) => ({
          ...schema,
          enum: allowedCauseValues(formData, index),
        }),
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      // Start with the full set; updateSchema will trim it at runtime
      cause: radioSchema(Object.keys(causeOptions)),
    },
    required: ['cause'],
  },
};

export default causePage;
