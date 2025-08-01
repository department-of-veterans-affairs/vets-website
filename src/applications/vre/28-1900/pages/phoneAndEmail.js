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
    mainPhone: phoneUI('Home phone number'),
    cellPhone: phoneUI('Mobile phone number'),
    internationalPhone: internationalPhoneUI('International phone number'),
    email: emailToSendNotificationsUI('Email'),
  },
  schema: {
    type: 'object',
    properties: {
      mainPhone: phoneSchema,
      cellPhone: phoneSchema,
      internationalPhone: internationalPhoneSchema(),
      email: emailToSendNotificationsSchema,
    },
    required: ['email'],
  },
};
