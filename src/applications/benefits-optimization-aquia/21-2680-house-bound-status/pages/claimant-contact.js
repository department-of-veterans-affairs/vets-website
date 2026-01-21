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

import { isClaimantVeteran } from '../utils/relationship-helpers';
import { getVeteranName, getClaimantName } from '../utils/name-helpers';

/**
 * uiSchema for Claimant Contact page
 * Collects claimant's phone numbers and email
 */
export const claimantContactUiSchema = {
  claimantContact: {
    claimantPhoneNumber: phoneUI('Home phone number'),
    claimantEmail: emailUI('Email address'),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const isVeteran = isClaimantVeteran(data);

      // Get the appropriate name based on relationship
      const fullName = isVeteran
        ? getVeteranName(data, '')
        : getClaimantName(data, '');

      // Use appropriate fallback based on relationship
      const fallback = isVeteran ? "Veteran's" : "Claimant's";

      const title = fullName
        ? `${fullName}'s phone number and email address`
        : `${fallback} phone number and email address`;

      const homePhoneLabel = fullName
        ? `${fullName}'s phone number`
        : `${fallback} phone number`;

      const emailLabel = fullName
        ? `${fullName}'s email address`
        : `${fallback} email address`;

      // Use appropriate pronouns for veterans vs other claimants
      const description = isVeteran
        ? 'We may use your contact information to contact you if we have questions about your application or if we need more information.'
        : 'We may use their contact information to contact them if we have questions about their application or if we need more information.';

      return {
        'ui:title': title,
        'ui:description': description,
        claimantContact: {
          claimantPhoneNumber: {
            'ui:title': homePhoneLabel,
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
  properties: {
    claimantContact: {
      type: 'object',
      properties: {
        claimantPhoneNumber: phoneSchema,
        claimantEmail: emailSchema,
      },
    },
  },
};
