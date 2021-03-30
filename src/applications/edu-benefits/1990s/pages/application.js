import fullSchema from 'vets-json-schema/dist/VRRAP-schema.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';

import {
  uiSchema as addressUISchema,
  schema as addressSchema,
} from 'platform/forms/definitions/address';

const {
  veteranFullName,
  veteranSocialSecurityNumber,
  dateOfBirth,
  email,
  mobilePhone,
  alternatePhone,
} = fullSchema.properties;

const addressUiSchema = addressUISchema('Address', false);
const address = addressSchema(fullSchema, true);

const path = 'form';
const title = 'Application';
const uiSchema = {
  'view:applicantInformation': {
    'ui:title': 'Applicant Information',
    veteranFullName: fullNameUI,
    veteranSocialSecurityNumber: ssnUI,
    dateOfBirth: {
      ...currentOrPastDateUI('Date of birth'),
      'ui:errorMessages': {
        required: 'Please provide a valid date',
        futureDate: 'Please provide a valid date',
      },
    },
  },
  'view:contactInformation': {
    'ui:title': 'Contact Information',
    'view:phoneAndEmail': {
      'ui:title': 'Phone & email',
      mobilePhone: phoneUI('Mobile phone number'),
      alternatePhone: phoneUI('Alternate phone number'),
      email: emailUI(),
    },
    mailingAddress: {
      ...addressUiSchema,
      'ui:field': ReviewCardField,
      'ui:options': {
        ...addressUiSchema['ui:options'],
        viewComponent: AddressViewField,
      },
      street: {
        ...addressUiSchema.street,
        'ui:title': 'Street address',
      },
      city: addressUiSchema.city,
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    'view:applicantInformation': {
      type: 'object',
      required: ['veteranSocialSecurityNumber', 'dateOfBirth'],
      properties: {
        veteranFullName,
        veteranSocialSecurityNumber,
        dateOfBirth,
      },
    },
    'view:contactInformation': {
      type: 'object',
      properties: {
        'view:phoneAndEmail': {
          type: 'object',
          required: ['mobilePhone', 'email'],
          properties: {
            mobilePhone,
            alternatePhone,
            email,
          },
        },
      },
    },
    mailingAddress: address,
    'view:contactInfoNote': {
      type: 'object',
      properties: {},
    },
  },
};

export { path, title, uiSchema, schema };
