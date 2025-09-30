/**
 * @module pages/phone-and-email-address
 * @description Page configuration for veteran contact information
 */

import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Page configuration for phone and email contact information
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

// Platform expects default export for pages
export default phoneAndEmailAddress;
