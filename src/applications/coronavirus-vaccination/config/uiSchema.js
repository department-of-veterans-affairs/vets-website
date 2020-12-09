import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
// import SelectFacilityWidget from '../components/SelectFacilityWidget';

import ssnUiSchema from 'platform/forms-system/src/js/definitions/ssn';

export default {
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
  },
  lastName: {
    'ui:title': 'Last name',
    'ui:errorMessages': {
      required: 'Please enter your last name.',
    },
  },
  birthDate: {
    'ui:title': 'Date of birth',
    'ui:widget': 'date',
    'ui:errorMessages': {
      required: 'Please enter your date of birth.',
    },
  },
  ssn: {
    ...ssnUiSchema,
    'ui:title': 'Social Security number (SSN)',
    'ui:required': formData => !formData.isIdentityVerified,
    'ui:options': {
      ...ssnUiSchema['ui:options'],
      hideIf: formData => formData.isIdentityVerified,
    },
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
  zipCodeDetails: {
    'ui:title': 'Will you be in this zip code for the next 6 to 12 months?',
    'ui:widget': 'radio',
    'ui:errorMessages': {
      required: 'Please select an answer.',
    },
  },
  vaccineInterest: {
    'ui:title': 'Are you interested in getting a COVID-19 vaccine at VA?',
    'ui:widget': 'radio',
    'ui:errorMessages': {
      required: 'Please select an answer.',
    },
    'ui:options': {
      labels: {
        INTERESTED: 'Yes',
        NOT_INTERESTED: 'No',
        UNDECIDED: 'I’m not sure yet.',
        PREFER_NO_ANSWER: 'I prefer not to answer',
      },
    },
  },
};
