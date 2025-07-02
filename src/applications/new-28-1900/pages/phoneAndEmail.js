import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  internationalPhoneDeprecatedSchema,
  internationalPhoneDeprecatedUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CONTACT_INFORMATION_CHAPTER_CONSTANTS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(CONTACT_INFORMATION_CHAPTER_CONSTANTS.phoneAndEmailPageTitle),
    mainPhone: phoneUI('Phone number'),
    cellPhone: phoneUI('Cell phone number'),
    internationalPhone: internationalPhoneDeprecatedUI(
      'International phone number',
    ),
    email: emailToSendNotificationsUI('Email address'),
  },
  schema: {
    type: 'object',
    properties: {
      mainPhone: phoneSchema,
      cellPhone: phoneSchema,
      internationalPhone: internationalPhoneDeprecatedSchema,
      email: emailToSendNotificationsSchema,
    },
    required: ['email'],
  },
};
