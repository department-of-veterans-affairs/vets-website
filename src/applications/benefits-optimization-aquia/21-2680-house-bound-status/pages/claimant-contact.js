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

import { getClaimantName } from '../utils/name-helpers';

/**
 * uiSchema for Claimant Contact page
 * Collects claimant's phone numbers and email
 */
export const claimantContactUiSchema = {
  claimantContact: {
    claimantPhoneNumber: phoneUI('Home phone number'),
    claimantMobilePhone: phoneUI('Mobile phone number'),
    claimantEmail: emailUI('Email address'),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;

      const claimantName = getClaimantName(data, 'Claimant');

      return {
        'ui:title': `${claimantName}'s phone number and email address`,
        'ui:description':
          'We may use their contact information to contact them if we have questions about their application or if we need more information.',
        claimantContact: {
          claimantPhoneNumber: {
            'ui:title': `${claimantName}'s home phone number`,
          },
          claimantMobilePhone: {
            'ui:title': `${claimantName}'s mobile phone number`,
          },
          claimantEmail: {
            'ui:title': `${claimantName}'s email address`,
          },
        },
      };
    },
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
