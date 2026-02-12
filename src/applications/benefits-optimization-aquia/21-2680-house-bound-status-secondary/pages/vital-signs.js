/**
 * @module pages/vital-signs
 * @description Standard form system configuration for Vital Signs page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects claimant blood pressure, pulse rate, and respiratory rate.
 * Field titles update dynamically based on claimant name via updateUiSchema.
 */

import {
  numberUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getClaimantName } from '@bio-aquia/21-2680-house-bound-status-secondary/utils';

/**
 * uiSchema for Vital Signs page
 * Collects blood pressure, pulse rate (bpm), and respiratory rate (bpm)
 */
export const vitalSignsUiSchema = {
  ...titleUI(
    ({ formData }) =>
      `${getClaimantName(
        formData,
      )}'s blood pressure, pulse, and respiratory rate`,
  ),
  bloodPressure: numberUI({
    title: 'Blood pressure',
    width: 'sm',
    errorMessages: {
      // TODO: determine the actual lenght we need for this field.
      required: 'Blood pressure is required',
    },
  }),
  pulseRate: numberUI({
    title: 'Pulse rate',
    width: 'sm',
    errorMessages: {
      required: 'Pulse rate is required (bpm)',
    },
  }),
  respiratoryRate: numberUI({
    title: 'Respiratory rate (bpm)',
    width: 'sm',
    errorMessages: {
      required: 'Respiratory rate is required',
    },
  }),
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const name = getClaimantName(fullData || formData);
      return {
        bloodPressure: { 'ui:title': `${name}'s blood pressure` },
        pulseRate: { 'ui:title': `${name}'s pulse rate` },
        respiratoryRate: { 'ui:title': `${name}'s respiratory rate` },
      };
    },
  },
};

/**
 * JSON Schema for Vital Signs page
 * Validates blood pressure, pulse rate, and respiratory rate fields
 */
export const vitalSignsSchema = {
  type: 'object',
  required: ['bloodPressure', 'pulseRate', 'respiratoryRate'],
  properties: {
    bloodPressure: { type: 'string', maxLength: 7 },
    pulseRate: { type: 'string', maxLength: 3 },
    respiratoryRate: { type: 'string', maxLength: 3 },
  },
};
