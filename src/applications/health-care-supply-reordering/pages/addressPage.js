import {
  addressSchema,
  addressUI,
  emailSchema,
  emailUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import AddressViewField from '../components/AddressViewField';
import ReviewCardField from '../components/ReviewCardField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    permanentAddress: {
      ...addressUI(),
      'ui:title': 'Permanent address',
      'ui:field': ReviewCardField,
      'ui:options': {
        hideOnReview: formData =>
          formData['view:currentAddress'] !== 'permanentAddress',
        startInEdit: formData => {
          return Object.values(formData).every(prop => Boolean(prop));
        },
        viewComponent: AddressViewField,
      },
    },
    temporaryAddress: {
      ...addressUI(),
      'ui:title': 'Temporary address',
      'ui:field': ReviewCardField,
      'ui:options': {
        // ...addressUI()['ui:options'],
        startInEdit: formData => {
          return Object.values(formData).every(prop => Boolean(prop));
        },
        hideOnReview: formData =>
          formData['view:currentAddress'] !== 'temporaryAddress',
        viewComponent: AddressViewField,
      },
    },
    vetEmail: emailUI(),
    viewCurrentAddressField: {
      'ui:options': {
        classNames: 'vads-u-display--none',
        hideOnReview: true,
        customTitle: ' ',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      permanentAddress: addressSchema({}),
      temporaryAddress: addressSchema({}),
      vetEmail: emailSchema,
      viewCurrentAddressField: {
        type: 'string',
        enum: ['permanentAddress', 'temporaryAddress'],
        default: 'permanentAddress',
      },
    },
    required: ['vetEmail'],
  },
};
