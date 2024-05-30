import {
  addressSchema,
  addressUI,
  emailSchema,
  emailUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import AddressViewField from '@department-of-veterans-affairs/platform-forms-system/AddressViewField';

import ReviewCardField from '../components/ReviewCardField';

// Wrap address fields with DL tags to resolve accessibility error.
const addressUiWithDlWrappedFields = () => {
  const customAddressUI = addressUI({ omit: ['street3'] });
  Object.keys(customAddressUI).forEach(element => {
    if (customAddressUI[element]['ui:options']) {
      customAddressUI[element]['ui:options'].useDlWrap = true;
    }
  });
  return customAddressUI;
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    permanentAddress: {
      ...addressUiWithDlWrappedFields(),
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
      ...addressUiWithDlWrappedFields(),
      'ui:title': 'Temporary address',
      'ui:field': ReviewCardField,
      'ui:options': {
        startInEdit: formData => {
          return Object.values(formData).every(prop => Boolean(prop));
        },
        hideOnReview: formData =>
          formData['view:currentAddress'] !== 'temporaryAddress',
        viewComponent: AddressViewField,
      },
    },
    vetEmail: {
      ...emailUI(),
      'ui:options': {
        inputType: 'email',
        useDlWrap: true,
        uswds: true,
      },
    },
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
      permanentAddress: addressSchema({ omit: ['street3'] }),
      temporaryAddress: addressSchema({ omit: ['street3'] }),
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
