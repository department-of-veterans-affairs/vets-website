import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import ReviewCardField from '../../components/ReviewCardField';
import PhoneNumberWidget from 'us-forms-system/lib/js/widgets/PhoneNumberWidget';
import PhoneNumberReviewWidget from 'us-forms-system/lib/js/review/PhoneNumberWidget';

import {
  phoneEmailViewField,
  AddressViewField,
  contactInfoNote,
  contactInfoDescription,
} from '../content/contactInformation';

import {
  uiSchema as addressUISchema,
  schema as addressSchema,
} from '../../../../platform/forms/definitions/address';

const { emailAddress, dayTimePhone, nightTimePhone } = fullSchema.properties;

const mailingAddressStartInEdit = formData => {
  if (formData) {
    const { street, city, state, postalCode } = formData;
    return !(street || city || state || postalCode);
  }
  return true;
};

export const uiSchema = {
  'ui:title': 'Contact Information',
  'ui:description': contactInfoDescription,
  phoneAndEmail: {
    'ui:title': 'Phone & email',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: phoneEmailViewField,
    },
    dayTimePhone: {
      'ui:title': 'Phone number',
      'ui:widget': PhoneNumberWidget,
      'ui:reviewWidget': PhoneNumberReviewWidget,
      'ui:errorMessages': {
        pattern: 'Phone numbers must be 10 digits (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
      },
    },
    nightTimePhone: {
      'ui:title': 'Alternate Phone number',
      'ui:widget': PhoneNumberWidget,
      'ui:reviewWidget': PhoneNumberReviewWidget,
      'ui:errorMessages': {
        pattern: 'Phone numbers must be 10 digits (dashes allowed)',
      },
      'ui:options': {
        widgetClassNames: 'va-input-medium-large',
      },
    },
    emailAddress: {
      'ui:title': 'Email address',
      'ui:errorMessages': {
        pattern: 'The email you enter should be in this format x@x.xx',
      },
    },
  },
  mailingAddress: {
    ...addressUISchema(),
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: AddressViewField,
      startInEdit: mailingAddressStartInEdit,
    },
  },
  'view:contactInfoNote': {
    'ui:title': ' ',
    'ui:description': contactInfoNote,
  },
};

export const schema = {
  type: 'object',
  properties: {
    phoneAndEmail: {
      type: 'object',
      required: ['dayTimePhone', 'emailAddress'],
      properties: {
        dayTimePhone,
        nightTimePhone,
        emailAddress,
      },
    },
    mailingAddress: addressSchema(fullSchema, true),
    'view:contactInfoNote': {
      type: 'object',
      properties: {},
    },
  },
};
