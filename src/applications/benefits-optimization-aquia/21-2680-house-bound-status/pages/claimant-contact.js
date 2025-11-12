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
  claimantContact: {
    claimantPhoneNumber: phoneUI('Home phone number'),
    claimantMobilePhone: phoneUI('Mobile phone number'),
    claimantEmail: emailUI('Email address'),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const firstName =
        data?.claimantInformation?.claimantFullName?.first || '';
      const lastName = data?.claimantInformation?.claimantFullName?.last || '';
      const fullName = `${firstName} ${lastName}`.trim();

      const title = fullName
        ? `${fullName}'s phone number and email address`
        : "Claimant's phone number and email address";

      const homePhoneLabel = fullName
        ? `${fullName}'s home phone number`
        : "Claimant's home phone number";

      const mobilePhoneLabel = fullName
        ? `${fullName}'s mobile phone number`
        : "Claimant's mobile phone number";

      const emailLabel = fullName
        ? `${fullName}'s email address`
        : "Claimant's email address";

      return {
        'ui:title': title,
        'ui:description':
          'We may use their contact information to contact them if we have questions about their application or if we need more information.',
        claimantContact: {
          claimantPhoneNumber: {
            'ui:title': homePhoneLabel,
          },
          claimantMobilePhone: {
            'ui:title': mobilePhoneLabel,
          },
          claimantEmail: {
            'ui:title': emailLabel,
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
