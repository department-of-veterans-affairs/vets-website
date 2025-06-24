import {
  addressSchema,
  addressUI,
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CONTACT_INFORMATION_CHAPTER_CONSTANTS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      CONTACT_INFORMATION_CHAPTER_CONSTANTS.veteranAddressPageTitle,
      "If you don't have a mailing address, you can skip the questions on this screen. You'll need to provide a phone number or email address later in this application, so we can set up your initial evaluation for VR&E benefits.",
    ),
    checkBoxGroup: checkboxGroupUI({
      title: ' ',
      labels: {
        checkForMailingAddress: {
          title: 'I do not have a mailing address',
        },
      },
      required: false,
    }),
    veteranAddress: addressUI({
      required: {
        country: formData => !formData?.checkBoxGroup?.checkForMailingAddress,
        street: formData => !formData?.checkBoxGroup?.checkForMailingAddress,
        city: formData => !formData?.checkBoxGroup?.checkForMailingAddress,
        postalCode: formData =>
          !formData?.checkBoxGroup?.checkForMailingAddress,
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      checkBoxGroup: checkboxGroupSchema(['checkForMailingAddress']),
      veteranAddress: addressSchema(),
    },
  },
};
