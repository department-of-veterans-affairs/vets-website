/**
 * @module pages/physical-measurements
 * @description Standard form system configuration for Physical Measurements page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects claimant age, weight (with estimate checkbox), and height (feet/inches).
 * Field titles update dynamically based on claimant name via updateUiSchema.
 */

import {
  numberUI,
  checkboxUI,
  checkboxSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getClaimantName } from '../utils/name-helpers';

/**
 * uiSchema for Physical Measurements page
 * Collects claimant age (yrs), weight (lbs), weight estimate flag, and height (ft/in).
 * Uses updateUiSchema to dynamically set field titles based on claimant name.
 */
export const physicalMeasurementsUiSchema = {
  ...titleUI(
    ({ formData }) => `${getClaimantName(formData)}'s age, weight, and height`,
  ),
  age: numberUI({
    title: 'Age',
    width: 'sm',
    min: 0,
    max: 150,
    errorMessages: {
      required: 'Age is required',
    },
  }),
  weight: numberUI({
    title: 'Weight',
    width: 'sm',
    min: 0,
    max: 1500,
    errorMessages: {
      required: 'Weight is required',
    },
  }),
  weightIsEstimate: checkboxUI({
    title: 'This weight is an estimate.',
  }),
  height: {
    feet: numberUI({
      title: 'Height',
      width: 'sm',
      min: 0,
      max: 9,
      errorMessages: {
        required: 'Height in feet is required',
      },
    }),
    inches: numberUI({
      title: ' ',
      width: 'sm',
      min: 0,
      max: 11,
      errorMessages: {
        required: 'Height in inches is required',
      },
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const name = getClaimantName(fullData || formData);
      return {
        age: { 'ui:title': `${name}'s age (yrs)` },
        weight: { 'ui:title': `${name}'s weight (lbs)` },
        height: {
          feet: { 'ui:title': `${name}'s height inches` },
          inches: { 'ui:title': `${name}'s height inches` },
        },
      };
    },
  },
};

/**
 * JSON Schema for Physical Measurements page
 * Validates age (max 3 digits), weight (max 3 digits),
 * weight estimate checkbox, and height with feet (max 1 digit) and inches (max 2 digits)
 */
export const physicalMeasurementsSchema = {
  type: 'object',
  required: ['age', 'weight', 'height'],
  properties: {
    age: {
      type: 'string',
      maxLength: 3,
    },
    weight: {
      type: 'string',
      maxLength: 3,
    },
    weightIsEstimate: checkboxSchema,
    height: {
      type: 'object',
      required: ['feet', 'inches'],
      properties: {
        feet: {
          type: 'string',
          maxLength: 1,
        },
        inches: {
          type: 'string',
          maxLength: 2,
        },
      },
    },
  },
};
