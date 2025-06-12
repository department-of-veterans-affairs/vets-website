import {
  internationalPhoneUI,
  internationalPhoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3InternationalPhone: internationalPhoneUI(),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3InternationalPhone: internationalPhoneSchema,
    },
    required: ['wcv3InternationalPhone'],
  },
};
