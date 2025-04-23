import {
  emailUI,
  emailSchema,
  phoneUI,
  phoneSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { PhoneNumberReviewWidget } from '../../../utils/PhoneNumberReviewWidget';

export const uiSchema = {
  contactInfo: {
    ...titleUI('Your contact information'),
    email: emailUI({
      errorMessages: {
        format:
          'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
        pattern:
          'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
      },
    }),
    mobilePhone: {
      ...phoneUI('Mobile phone number'),
      'ui:reviewWidget': PhoneNumberReviewWidget,
    },
    homePhone: {
      ...phoneUI('Home phone number'),
      'ui:reviewWidget': PhoneNumberReviewWidget,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    contactInfo: {
      type: 'object',
      required: ['email'],
      properties: {
        email: emailSchema,
        mobilePhone: phoneSchema,
        homePhone: phoneSchema,
      },
    },
  },
};
