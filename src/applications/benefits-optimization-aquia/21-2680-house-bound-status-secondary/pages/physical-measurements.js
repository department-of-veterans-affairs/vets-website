/**
 *
 */

import {
  numberUI,
  checkboxUI,
  checkboxSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const getClaimantName = formData => {
  const first = formData?.fullName?.first || '';
  const last = formData?.fullName?.last || '';
  return first && last ? `${first} ${last}` : 'Claimant';
};

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
