/**
 * @module config/form/pages/monthly-costs
 * @description Standard form system configuration for Monthly Costs page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Monthly Costs page
 * Collects patient's monthly out-of-pocket costs
 */
export const monthlyCostsUiSchema = {
  monthlyCosts: {
    monthlyOutOfPocket: currencyUI({
      title:
        'What is the amount the patient needs to pay out of their own pocket every month?',
      hint: "Include the patient's Share of Cost Medicaid.",
    }),
  },
};

/**
 * JSON Schema for Monthly Costs page
 * Validates monthly cost amount
 */
export const monthlyCostsSchema = {
  type: 'object',
  required: ['monthlyCosts'],
  properties: {
    monthlyCosts: {
      type: 'object',
      required: ['monthlyOutOfPocket'],
      properties: {
        monthlyOutOfPocket: currencySchema,
      },
    },
  },
};
