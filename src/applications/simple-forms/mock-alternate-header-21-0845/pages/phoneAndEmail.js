import {
  phoneUI,
  emailUI,
  phoneSchema,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleH1UI } from '../components/customTitlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleH1UI('Your phone and email'),
    phone: phoneUI(),
    email: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['phone'],
    properties: {
      phone: phoneSchema,
      email: emailSchema,
    },
  },
};
