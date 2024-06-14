import * as address from 'platform/forms-system/src/js/definitions/address';
import { dateOfBirthUI } from 'platform/forms-system/src/js/web-component-patterns';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import platformSsnUI from 'platform/forms-system/src/js/definitions/ssn';
import email from 'platform/forms-system/src/js/definitions/email';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';
import { validateSSNIsUnique } from '../../utils/helpers';
import { EmailEncouragementDescription } from '../../components/FormDescriptions';
import AddressWithAutofill from '../../components/FormFields/AddressWithAutofill';

const stateLabels = createUSAStateLabels(states);

export const emailUI = label => email(`${label} email address`);
export const dobUI = label => dateOfBirthUI(`${label} date of birth`);

export const addressUI = address.uiSchema(' ', false);

export const primaryPhoneNumberUI = label =>
  phoneUI(`${label} primary telephone number (including area code)`);

export const alternativePhoneNumberUI = label =>
  phoneUI(`${label} alternate telephone number (including area code)`);

export const vetRelationshipUI = label => ({
  'ui:title': `What is the ${label} relationship to the Veteran?`,
});

export const genderUI = label => ({
  'ui:title': `${label} sex`,
  'ui:widget': 'radio',
  'ui:options': { labels: { F: 'Female', M: 'Male' } },
});

export const fullNameUI = label => ({
  first: {
    'ui:title': `${label} legal first name`,
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

/**
 * Extend a specific field within a UI schema object with additional properties.
 *
 * @param {Object} originalUI - The original UI schema object that you want to extend.
 * @param {string} fieldName - The name of the field within the UI schema that you want to extend (e.g., 'first', 'last', 'middle').
 * @param {string} uiKey - The UI property key you want to add or modify (e.g., 'ui:description', 'ui:options').
 * @param {*} uiValue - The value for the UI property key you're adding or modifying.
 *
 * @returns {Object} A new UI schema object with the specified field extended with the given UI key-value pair.
 *
 * @example
 * const vetUI = { first: { 'ui:title': 'Veteran's legal first name' } };
 * const extendedNameUI = customFieldSchemaUI(vetUI, 'first', 'ui:description', 'Enter your first name');
 * // extendedNameUI now is: { first: { 'ui:title': 'Veteran's legal first name', 'ui:description': 'Enter your first name' } }
 */
export const customFieldSchemaUI = (originalUI, fieldName, uiKey, uiValue) => {
  if (!originalUI[fieldName]) {
    // If the field name doesn't exist in the originalUI, we just return the original without changes
    return originalUI;
  }

  return {
    ...originalUI,
    [fieldName]: {
      ...originalUI[fieldName],
      [uiKey]: uiValue,
    },
  };
};

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
