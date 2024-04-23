import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getPhoneAndEmailPageTitle } from '../helpers';

/** @type {PageSchema} */
export const phoneAndEmailPage = {
  uiSchema: {
    ...titleUI('Your phone and email address'),
    phone: phoneUI('Phone number'),
    emailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      phone: phoneSchema,
      emailAddress: emailSchema,
    },
  },
};

/** @type {PageSchema} */
export const veteranPhoneAndEmailPage = {
  uiSchema: {
    ...titleUI(({ formData }) => getPhoneAndEmailPageTitle(formData)),
    veteranPhone: phoneUI('Phone number'),
    veteranEmailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranPhone: phoneSchema,
      veteranEmailAddress: emailSchema,
    },
  },
};

/** @type {PageSchema} */
export const nonVeteranPhoneAndEmailPage = {
  uiSchema: {
    ...titleUI(({ formData }) => getPhoneAndEmailPageTitle(formData)),
    nonVeteranPhone: phoneUI('Phone number'),
    nonVeteranEmailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      nonVeteranPhone: phoneSchema,
      nonVeteranEmailAddress: emailSchema,
    },
  },
};
