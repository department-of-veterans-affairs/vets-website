/**
 * @module pages/blindness-details
 * @description Standard form system configuration for Blindness Details page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects blindness explanation and corrected vision measurements.
 * Only shown when isLegallyBlind is true.
 */

import React from 'react';
import {
  textareaUI,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Blindness Details page
 * Explanation textarea and corrected vision fields
 */
export const blindnessDetailsUiSchema = {
  ...titleUI('Blindness'),
  blindnessExplanation: textareaUI({
    title: "Provide an explanation of the patient's blindness",
  }),
  'view:correctedVisionHeading': {
    'ui:description': React.createElement(
      'div',
      null,
      React.createElement('h4', null, 'Corrected vision'),
      React.createElement('p', null, 'If applicable'),
    ),
  },
  leftEye: textUI({ title: 'Left eye' }),
  rightEye: textUI({ title: 'Right eye' }),
};

/**
 * JSON Schema for Blindness Details page
 * Validates blindness explanation and corrected vision
 */
export const blindnessDetailsSchema = {
  type: 'object',
  properties: {
    blindnessExplanation: { type: 'string' },
    'view:correctedVisionHeading': { type: 'object', properties: {} },
    leftEye: { type: 'string' },
    rightEye: { type: 'string' },
  },
};
