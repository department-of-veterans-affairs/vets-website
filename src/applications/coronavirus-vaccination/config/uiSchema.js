import React from 'react';

import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';

// import SelectFacilityWidget from '../components/SelectFacilityWidget';

import MaskedSSNWidget from '../components/MaskedSSNWidget';
import {
  validateSSN,
  validateCurrentOrPastDate,
} from 'platform/forms-system/src/js/validation';

export default {
  authenticated: {
    isIdentityVerified: {
      'ui:options': {
        hideIf: () => true,
      },
    },
    firstName: {
      'ui:title': 'First name',
      'ui:errorMessages': {
        required: 'Please enter your first name.',
      },
      'ui:disabled': true,
    },
    lastName: {
      'ui:title': 'Last name',
      'ui:errorMessages': {
        required: 'Please enter your last name.',
      },
      'ui:disabled': true,
    },
    birthDate: {
      'ui:title': 'Date of birth',
      'ui:description': () => (
        <span>
          <b>Note: </b>
          Your date of birth helps us match your information to your Veteran
          records so we can better understand your needs.
        </span>
      ),
      'ui:widget': 'date',
      'ui:disabled': true,
    },
    ssn: {
      'ui:widget': MaskedSSNWidget,
      'ui:title': 'Social Security number (SSN)',
      'ui:description': () => (
        <span>
          <b>Note: </b>
          Your SSN helps us match your information to your Veteran records so we
          can better understand your needs.
        </span>
      ),
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        hideIf: formData => formData.isIdentityVerified,
      },
      'ui:errorMessages': {
        pattern: 'Please enter a valid 9 digit SSN (dashes allowed)',
        required: 'Please enter a SSN',
      },
      'ui:validations': [validateSSN],
    },
    email: {
      'ui:title': 'Email address',
      'ui:widget': 'email',
      'ui:errorMessages': {
        required: 'Please enter your email address, using this format: X@X.com',
        pattern:
          'Please enter your email address again, using this format: X@X.com',
      },
    },
    phone: {
      'ui:title': 'Phone',
      'ui:widget': PhoneNumberWidget,
      'ui:errorMessages': {
        required: 'Please enter your phone number',
        pattern: 'Please enter a valid phone number',
      },
    },
    zipCode: {
      'ui:title': 'Zip code',
      'ui:errorMessages': {
        required: 'Please enter your zip code',
        pattern: 'Please enter a valid zip code',
      },
    },
    locationDetails: {
      'ui:title': 'Will you be in this zip code for the next 6 to 12 months?',
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Please select an answer.',
      },
      'ui:options': {
        labels: {
          Yes: 'Yes',
          No: 'No',
          Unsure: "I'm not sure.",
        },
      },
    },
    vaccineInterest: {
      'ui:title':
        'Do you plan to get a COVID-19 vaccine when one is available to you?',
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Please select an answer.',
      },
      'ui:options': {
        labels: {
          INTERESTED: 'Yes',
          NOT_INTERESTED: 'No',
          UNDECIDED: 'I’m not sure yet.',
          PREFER_NO_ANSWER: 'I prefer not to answer.',
        },
      },
    },
  },
  unauthenticated: {
    isIdentityVerified: {
      'ui:options': {
        hideIf: () => true,
      },
    },
    firstName: {
      'ui:title': 'First name',
      'ui:errorMessages': {
        required: 'Please enter your first name.',
      },
      'ui:disabled': false,
    },
    lastName: {
      'ui:title': 'Last name',
      'ui:errorMessages': {
        required: 'Please enter your last name.',
      },
      'ui:disabled': false,
    },
    birthDate: {
      'ui:title': 'Date of birth',
      'ui:description': () => (
        <span>
          <b>Note: </b>
          Your date of birth helps us match your information to your Veteran
          records so we can better understand your needs.
        </span>
      ),
      'ui:widget': 'date',
      'ui:disabled': false,
      'ui:errorMessages': {
        pattern: 'Please enter a complete date',
      },
      'ui:validations': [validateCurrentOrPastDate],
    },
    ssn: {
      'ui:widget': MaskedSSNWidget,
      'ui:title': 'Social Security number (SSN)',
      'ui:description': () => (
        <span>
          <b>Note: </b>
          Your SSN helps us match your information to your Veteran records so we
          can better understand your needs.
        </span>
      ),
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
        hideIf: formData => formData.isIdentityVerified,
      },
      'ui:errorMessages': {
        pattern: 'Please enter a valid 9 digit SSN (dashes allowed)',
        required: 'Please enter a SSN',
      },
      'ui:validations': [validateSSN],
    },
    email: {
      'ui:title': 'Email address',
      'ui:widget': 'email',
      'ui:errorMessages': {
        required: 'Please enter your email address, using this format: X@X.com',
        pattern:
          'Please enter your email address again, using this format: X@X.com',
      },
    },
    phone: {
      'ui:title': 'Phone',
      'ui:widget': PhoneNumberWidget,
      'ui:errorMessages': {
        required: 'Please enter your phone number',
        pattern: 'Please enter a valid phone number',
      },
    },
    zipCode: {
      'ui:title': 'Zip code',
      'ui:errorMessages': {
        required: 'Please enter your zip code',
        pattern: 'Please enter a valid zip code',
      },
    },
    locationDetails: {
      'ui:title': 'Will you be in this zip code for the next 6 to 12 months?',
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Please select an answer.',
      },
      'ui:options': {
        labels: {
          Yes: 'Yes',
          No: 'No',
          Unsure: "I'm not sure.",
        },
      },
    },
    vaccineInterest: {
      'ui:title':
        'Do you plan to get a COVID-19 vaccine when one is available to you?',
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Please select an answer.',
      },
      'ui:options': {
        labels: {
          INTERESTED: 'Yes',
          NOT_INTERESTED: 'No',
          UNDECIDED: 'I’m not sure yet.',
          PREFER_NO_ANSWER: 'I prefer not to answer.',
        },
      },
    },
  },
};
