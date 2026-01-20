import {
  addressSchema,
  addressUI,
  emailSchema,
  emailUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import AddressViewField from '@department-of-veterans-affairs/platform-forms-system/AddressViewField';

import ReviewCardField from '../components/ReviewCardField';
import { schemaFields } from '../constants';

const {
  permanentAddressField,
  temporaryAddressField,
  viewCurrentAddressField,
  vetEmailField,
} = schemaFields;

// Wrap address fields with DL tags to resolve accessibility error.
const addressUiWithDlWrappedFields = (options = {}) => {
  const customAddressUI = addressUI({ omit: ['street3'], ...options });
  Object.keys(customAddressUI).forEach(element => {
    if (customAddressUI[element]['ui:options']) {
      customAddressUI[element]['ui:options'].useDlWrap = true;
    }
  });
  return customAddressUI;
};

// Make all address fields optional
const optionalAddressRequired = {
  street: () => false,
  city: () => false,
  state: () => false,
  postalCode: () => false,
  country: () => false,
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    [permanentAddressField]: {
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
    [temporaryAddressField]: {
      ...addressUiWithDlWrappedFields({ required: optionalAddressRequired }),
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
    [vetEmailField]: {
      ...emailUI(),
      'ui:options': {
        inputType: 'email',
        useDlWrap: true,
        uswds: true,
      },
    },
    [viewCurrentAddressField]: {
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
      [permanentAddressField]: addressSchema({ omit: ['street3'] }),
      [temporaryAddressField]: addressSchema({ omit: ['street3'] }),
      [vetEmailField]: emailSchema,
      [viewCurrentAddressField]: {
        type: 'string',
        enum: ['permanentAddress', 'temporaryAddress'],
        default: 'permanentAddress',
      },
    },
    required: ['vetEmail'],
  },
};
