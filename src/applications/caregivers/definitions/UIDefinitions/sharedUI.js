import * as address from 'platform/forms-system/src/js/definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import platformSsnUI from 'platform/forms-system/src/js/definitions/ssn';
import email from 'platform/forms-system/src/js/definitions/email';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';
import { validateSSNIsUnique } from '../../utils/helpers';
import {
  EmailEncouragementDescription,
  VeteranFullNameDescription,
  VeteranHomeAddressDescription,
} from '../../components/FormDescriptions';
import AddressWithAutofill from '../../components/FormFields/AddressWithAutofill';

const stateLabels = createUSAStateLabels(states);

export const emailUI = label => email(`${label}  email address`);
export const dateOfBirthUI = label =>
  currentOrPastDateUI(`${label}  date of birth`);

export const addressUI = address.uiSchema(' ', false);

export const primaryPhoneNumberUI = label =>
  phoneUI(`${label}  primary telephone number (including area code)`);

export const alternativePhoneNumberUI = label =>
  phoneUI(`${label}  alternate telephone number (including area code)`);

export const vetRelationshipUI = label => ({
  'ui:title': `What is the ${label}  relationship to the Veteran?`,
});

export const genderUI = label => ({
  'ui:title': `${label} sex`,
  'ui:widget': 'radio',
  'ui:options': { labels: { F: 'Female', M: 'Male' } },
});

export const fullNameUI = label => ({
  first: {
    'ui:title': `${label} legal first name`,
    'ui:description': VeteranFullNameDescription,
    'ui:errorMessages': {
      required: `Please enter ${label} legal first name`,
    },
  },
  last: {
    'ui:title': `${label} last name`,
    'ui:errorMessages': {
      required: `Please enter ${label}  last name`,
    },
  },
  middle: {
    'ui:title': `${label} middle name`,
  },
});

export const ssnUI = label => ({
  ...platformSsnUI,
  'ui:title': `${label} Social Security number or tax identification number`,
  'ui:options': {
    widgetClassNames: 'usa-input-medium',
  },
  'ui:errorMessages': {
    pattern:
      'Please enter a valid Social Security or tax identification number',
    required: 'Please enter a Social Security or tax identification number',
  },
  'ui:validations': [
    ...platformSsnUI['ui:validations'],
    {
      validator: (errors, _fieldData, formData) => {
        validateSSNIsUnique(errors, formData);
      },
    },
  ],
});

export const addressWithoutCountryUI = label => ({
  'ui:title': ' ',
  'ui:order': ['street', 'street2', 'city', 'state', 'postalCode'],
  street: {
    'ui:title': `${label} current home address`,
    'ui:description': VeteranHomeAddressDescription,
    'ui:errorMessages': { required: 'Please enter a home address' },
  },
  street2: {
    'ui:title': `Home address line 2`,
  },
  city: {
    'ui:title': `City`,
    'ui:errorMessages': { required: 'Please enter a city' },
  },
  state: {
    'ui:title': `State`,
    'ui:options': {
      labels: stateLabels,
    },
    'ui:errorMessages': { required: 'Please enter a state' },
  },
  postalCode: {
    'ui:title': `Postal code`,
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:errorMessages': {
      required: 'Please enter a postal code',
      pattern:
        'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
    },
  },
});

export const addressWithAutofillUI = () => ({
  'ui:field': AddressWithAutofill,
  'ui:options': {
    hideTextLabel: true,
  },
});

export const emailEncouragementUI = () => ({
  'ui:description': EmailEncouragementDescription,
});
