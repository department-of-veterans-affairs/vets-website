import {
  emailSchema,
  emailUI,
  phoneSchema,
  phoneUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getPhoneAndEmailPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
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
    required: ['nonVeteranPhone'],
  },
};
