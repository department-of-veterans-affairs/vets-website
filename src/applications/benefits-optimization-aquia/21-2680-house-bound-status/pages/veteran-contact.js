/**
 * @module config/form/pages/veteran-contact
 * @description Standard form system configuration for veteran Contact Information page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for veteran Contact page
 * Collects veteran's phone numbers and email
 */
export const veteranContactUiSchema = {
  veteranContact: {
    veteranPhoneNumber: phoneUI('Home phone number'),
    veteranMobilePhone: phoneUI('Mobile phone number'),
    veteranEmail: emailUI('Email address'),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const firstName = data?.veteranInformation?.veteranFullName?.first || '';
      const lastName = data?.veteranInformation?.veteranFullName?.last || '';
      const fullName = `${firstName} ${lastName}`.trim();

      const title = fullName
        ? `${fullName}'s phone number and email address`
        : "veteran's phone number and email address";

      const homePhoneLabel = fullName
        ? `${fullName}'s home phone number`
        : "veteran's home phone number";

      const mobilePhoneLabel = fullName
        ? `${fullName}'s mobile phone number`
        : "veteran's mobile phone number";

      const emailLabel = fullName
        ? `${fullName}'s email address`
        : "veteran's email address";

      return {
        'ui:title': title,
        'ui:description':
          'We may use their contact information to contact them if we have questions about their application or if we need more information.',
        veteranContact: {
          veteranPhoneNumber: {
            'ui:title': homePhoneLabel,
          },
          veteranMobilePhone: {
            'ui:title': mobilePhoneLabel,
          },
          veteranEmail: {
            'ui:title': emailLabel,
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for veteran Contact page
 * Validates veteran contact fields
 */
export const veteranContactSchema = {
  type: 'object',
  required: ['veteranContact'],
  properties: {
    veteranContact: {
      type: 'object',
      required: ['veteranPhoneNumber'],
      properties: {
        veteranPhoneNumber: phoneSchema,
        veteranMobilePhone: phoneSchema,
        veteranEmail: emailSchema,
      },
    },
  },
};
