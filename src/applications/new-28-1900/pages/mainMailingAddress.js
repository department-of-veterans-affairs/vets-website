import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Mailing Address',
      "If you don't have a mailing address, you can skip the questions on this screen. You'll need to provide a phone number or email address later in this application, so we can set up your initial evaluation for VR&E benefits.",
    ),
    mainMailingAddress: addressUI({
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      mainMailingAddress: addressSchema(),
    },
  },
};
