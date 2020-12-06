import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';

export default {
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
    'ui:title': 'Facility to receive vacccine',
    'ui:widget': 'text',
    'ui:options': {
      hideIf: formData => formData.vaxPreference !== 'INTERESTED',
    },
  },
};
