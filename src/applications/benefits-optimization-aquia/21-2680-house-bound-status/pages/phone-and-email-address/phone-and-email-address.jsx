/**
 * @module pages/phone-and-email-address
 * @description Page configuration for veteran's contact information
 */

import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Phone and email address page configuration
 * Collects veteran's phone numbers and email for contact purposes
 * @type {PageSchema}
 */
export const phoneAndEmailAddress = {
  uiSchema: {
    ...titleUI('Phone and email address'),
    homePhone: phoneUI('Home phone number'),
    mobilePhone: phoneUI('Mobile phone number'),
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      homePhone: phoneSchema,
      mobilePhone: phoneSchema,
      emailAddress: emailSchema,
    },
    required: ['homePhone'],
  },
};
