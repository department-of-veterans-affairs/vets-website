/**
 * @module config/form/pages/claimant-contact
 * @description Standard form system configuration for Claimant Contact Information page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Claimant Contact page
 * Collects claimant's phone numbers and email
 */
export const claimantContactUiSchema = {
  'ui:title': 'Claimant contact information',
  claimantContact: {
    claimantPhoneNumber: phoneUI('Primary phone number'),
    claimantMobilePhone: phoneUI('Mobile phone number (optional)'),
    claimantEmail: emailUI(),
  },
};

/**
 * JSON Schema for Claimant Contact page
 * Validates claimant contact fields
 */
export const claimantContactSchema = {
  type: 'object',
  required: ['claimantContact'],
  properties: {
    claimantContact: {
      type: 'object',
      required: ['claimantPhoneNumber', 'claimantEmail'],
      properties: {
        claimantPhoneNumber: phoneSchema,
        claimantMobilePhone: phoneSchema,
        claimantEmail: emailSchema,
      },
    },
  },
};
