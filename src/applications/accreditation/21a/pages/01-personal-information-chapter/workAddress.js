import {
  addressSchema,
  addressUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const workAddressRequired = ['EMPLOYED', 'SELF_EMPLOYED'];
const workAddressOptional = ['OTHER'];

const requireWorkAddress = formData =>
  workAddressRequired.includes(formData.employmentStatus);
const optionalWorkAddress = formData =>
  workAddressOptional.includes(formData.employmentStatus);

/** @type {PageSchema} */
export default {
  title: 'Work address',
  path: 'work-address',
  depends: formData =>
    requireWorkAddress(formData) || optionalWorkAddress(formData),
  uiSchema: {
    ...titleUI('Work address'),
    workName: textUI('Business name'),
    workAddress: addressUI({
      labels: {
        militaryCheckbox:
          'I work on a United States military base outside of the U.S.',
      },
      required: {
        country: formData => requireWorkAddress(formData),
        street: formData => requireWorkAddress(formData),
        city: formData => requireWorkAddress(formData),
        state: formData =>
          requireWorkAddress(formData) &&
          formData.workAddress.country === 'USA',
        postalCode: formData => requireWorkAddress(formData),
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      workName: textSchema,
      workAddress: addressSchema({
        omit: ['street3'],
      }),
    },
    required: ['workName'],
  },
};
