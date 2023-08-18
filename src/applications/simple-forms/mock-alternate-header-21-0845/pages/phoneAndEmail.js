import {
  phoneUI,
  emailUI,
  phoneSchema,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleH1Schema, titleH1UI } from '../components/customTitlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleH1UI('Your phone and email'),
    phone: phoneUI(),
    email: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['phone'],
    properties: {
      'view:title': titleH1Schema,
      phone: phoneSchema,
      email: emailSchema,
    },
  },
};
