import {
  titleUI,
  internationalPhoneUI,
  internationalPhoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('International contact information'),
    intHomePhone: internationalPhoneUI({
      title: 'Home phone number',
    }),
    intMobilePhone: internationalPhoneUI({
      title: 'Mobile phone number',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      intHomePhone: internationalPhoneSchema(),
      intMobilePhone: internationalPhoneSchema(),
    },
    required: ['intHomePhone'],
  },
};
