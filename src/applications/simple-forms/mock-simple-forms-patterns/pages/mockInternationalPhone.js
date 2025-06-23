import {
  internationalPhoneUI,
  createInternationalPhoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3InternationalPhone: internationalPhoneUI({}),
    wcv3InternationalPhoneSecondary: internationalPhoneUI({
      title: 'Secondary phone number',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3InternationalPhone: createInternationalPhoneSchema(true),
      wcv3InternationalPhoneSecondary: createInternationalPhoneSchema(),
    },
    required: ['wcv3InternationalPhone'],
  },
};
