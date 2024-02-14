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
    veteranPhone: phoneUI('Phone number'),
    veteranEmailAddress: emailUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranPhone: phoneSchema,
      veteranEmailAddress: emailSchema,
    },
    required: ['veteranPhone'],
  },
};
