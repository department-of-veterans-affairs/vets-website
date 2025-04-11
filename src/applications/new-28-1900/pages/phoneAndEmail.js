import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  internationalPhoneSchema,
  internationalPhoneUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CONTACT_INFORMATION_CHAPTER_CONSTANTS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(CONTACT_INFORMATION_CHAPTER_CONSTANTS.phoneAndEmailPageTitle),
    phone: phoneUI('Phone number'),
    cellPhone: phoneUI('Cell phone number'),
    internationalPhone: internationalPhoneUI('International phone number'),
    emailAddress: emailToSendNotificationsUI('Email address'),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      cellPhone: phoneSchema,
      internationalPhone: internationalPhoneSchema,
      emailAddress: emailToSendNotificationsSchema,
    },
    required: ['emailAddress'],
  },
};
