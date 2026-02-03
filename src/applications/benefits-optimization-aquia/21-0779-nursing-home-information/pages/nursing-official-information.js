/**
 * @module config/form/pages/nursing-official-information
 * @description Standard form system configuration for Nursing Official Information page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  firstNameLastNameNoSuffixUI,
  firstNameLastNameNoSuffixSchema,
  textUI,
  phoneUI,
  phoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Nursing Official Information page
 * Collects personal information from the nursing home official completing the form
 */
export const nursingOfficialInformationUiSchema = {
  'ui:title': 'Nursing home official personal information',
  'ui:description':
    'Only an official representative from a nursing home can fill out this form.',
  nursingOfficialInformation: {
    fullName: firstNameLastNameNoSuffixUI(title => `Your ${title}`),
    jobTitle: textUI({
      title: 'Your nursing home job title',
    }),
    phoneNumber: phoneUI({
      title: 'Your phone number',
      hint:
        "We'll use this number to contact you if we have any questions about this form.",
    }),
  },
};

/**
 * JSON Schema for Nursing Official Information page
 * Validates nursing home official's personal information
 */
export const nursingOfficialInformationSchema = {
  type: 'object',
  required: ['nursingOfficialInformation'],
  properties: {
    nursingOfficialInformation: {
      type: 'object',
      required: ['fullName', 'jobTitle', 'phoneNumber'],
      properties: {
        fullName: firstNameLastNameNoSuffixSchema,
        jobTitle: {
          type: 'string',
          maxLength: 65,
        },
        phoneNumber: phoneSchema,
      },
    },
  },
};
