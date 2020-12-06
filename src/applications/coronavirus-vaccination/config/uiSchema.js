import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import SelectFacilityWidget from '../components/SelectFacilityWidget';

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
  dateOfBirth: {
    'ui:title': 'Date of birth',
    'ui:widget': 'date',
    'ui:errorMessages': {
      required: 'Please enter your date of birth.',
    },
  },
  ssn: {
    'ui:title': 'Social Security Number (SSN)',
    'ui:errorMessages': {
      required: 'Please enter your social security number.',
      pattern: 'Please enter a valid social security number.',
    },
    'ui:required': formData => !formData.isIdentityVerified,
    'ui:options': {
      hideIf: formData => formData.isIdentityVerified,
    },
  },
  emailAddress: {
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
  vaxPreference: {
    'ui:title': 'Interested in vaccine',
    'ui:widget': 'radio',
    'ui:errorMessages': {
      required: 'Please select an answer.',
    },
    'ui:options': {
      labels: {
        INTERESTED: 'Interested',
        NOT_INTERESTED: 'Not interested',
        UNDECIDED: 'Unsure',
        ALREADY_VACCINATED: 'Already received a vaccination',
      },
      classNames: '',
    },
  },
  facility: {
    'ui:title':
      'Please select where you’d like to receive the COVID-19 vaccine.',
    'ui:widget': SelectFacilityWidget,
    'ui:required': formData => formData.vaxPreference === 'INTERESTED',
    'ui:options': {
      expandUnder: 'vaxPreference',
      hideIf: formData => formData.vaxPreference !== 'INTERESTED',
    },
  },
};
