import _ from 'lodash';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { AddressViewField } from '../components/AddressViewField';
import { PhoneEmailViewField } from '../components/PhoneEmailViewField';

import {
  contactInfoNote,
  contactInfoDescription,
} from '../content/contactInformation';

import {
  uiSchema as addressUISchema,
  schema as addressSchema,
} from 'platform/forms/definitions/address';

const { emailAddress, dayTimePhone, nightTimePhone } = fullSchema.properties;

const mailingAddressStartInEdit = formData => {
  if (formData) {
    const { street, city, state, postalCode } = formData;
    return !(street || city || state || postalCode);
  }
  return true;
};

const isRequiredForAddressUi = formData => {
  const { country } = _.get(formData, 'mailingAddress', {});
  return country && country === 'USA';
};

const addressUiSchema = addressUISchema(
  'Address',
  true,
  isRequiredForAddressUi,
);
const address = addressSchema(fullSchema, true);

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description': contactInfoDescription,
  'view:phoneAndEmail': {
    'ui:title': 'Phone & email',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PhoneEmailViewField,
    },
    saveClickTrackEvent: { event: 'edu-0994-personal-information-saved' },
    dayTimePhone: phoneUI('Phone number'),
    nightTimePhone: phoneUI('Alternate Phone number'),
    emailAddress: emailUI(),
  },
  mailingAddress: {
    ...addressUiSchema,
    'ui:field': ReviewCardField,
    'ui:options': {
      ...addressUiSchema['ui:options'],
      viewComponent: AddressViewField,
      startInEdit: mailingAddressStartInEdit,
    },
    saveClickTrackEvent: { event: 'edu-0994-personal-information-saved' },
    street: {
      ...addressUiSchema.street,
      'ui:title': 'Street address',
    },
    street2: {
      ...addressUiSchema.street2,
      'ui:title': 'Street address (line 2)',
    },
    street3: {
      ...addressUiSchema.street3,
      'ui:title': 'Street address (line 3)',
    },
    city: addressUiSchema.city,
  },
  'view:contactInfoNote': {
    'ui:description': contactInfoNote,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:phoneAndEmail': {
      type: 'object',
      required: ['dayTimePhone', 'emailAddress'],
      properties: {
        dayTimePhone,
        nightTimePhone,
        emailAddress,
      },
    },
    mailingAddress: address,
    'view:contactInfoNote': {
      type: 'object',
      properties: {},
    },
  },
};
