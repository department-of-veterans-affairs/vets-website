/**
 * @module pages/blindness
 * @description Standard form system configuration for Blindness page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects legal blindness status with conditionally revealed explanation,
 * and corrected vision measurements for left and right eyes.
 */

import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
  textareaUI,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** Textarea config for blindness explanation, revealed when "Yes" is selected */
const blindnessExplanationTextarea = textareaUI({
  title: 'If yes, provide explanation',
});

/**
 * uiSchema for Blindness page
 * Yes/No radio with conditionally revealed textarea, plus corrected vision fields
 */
export const blindnessUiSchema = {
  ...titleUI('Blindness'),
  isLegallyBlind: yesNoUI({
    title: 'Is the patient legally blind?',
    required: () => true,
    errorMessages: {
      required: 'Please select yes or no',
    },
  }),
  blindnessExplanation: {
    ...blindnessExplanationTextarea,
    'ui:options': {
      ...blindnessExplanationTextarea['ui:options'],
      expandUnder: 'isLegallyBlind',
      expandUnderCondition: true,
      expandedContentFocus: true,
    },
  },
  'view:correctedVisionHeading': {
    'ui:description': React.createElement('h4', null, 'Corrected vision'),
  },
  leftEye: textUI({ title: 'Left eye' }),
  rightEye: textUI({ title: 'Right eye' }),
};

/**
 * JSON Schema for Blindness page
 * Validates legal blindness selection, optional explanation, and corrected vision
 */
export const blindnessSchema = {
  type: 'object',
  required: ['isLegallyBlind'],
  properties: {
    isLegallyBlind: yesNoSchema,
    blindnessExplanation: { type: 'string' },
    'view:correctedVisionHeading': { type: 'object', properties: {} },
    leftEye: { type: 'string' },
    rightEye: { type: 'string' },
  },
};
