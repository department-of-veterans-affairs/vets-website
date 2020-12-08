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
  contactPreference: {
    'ui:title': 'Do you have a preference for contacting you?',
    'ui:widget': 'yesNo',
    'ui:errorMessages': {
      required: 'Please select an option',
    },
  },
  contactMethod: {
    'ui:title': 'Contact method',
    'ui:widget': 'radio',
    'ui:required': formData => formData.contactPreference,
    'ui:errorMessages': {
      required: 'Please select a contact method',
    },
    'ui:options': {
      labels: {
        phone: 'Phone',
        email: 'Email',
      },
      hideIf: formData => !formData.contactPreference,
      expandUnder: 'contactPreference',
    },
  },
  vaccineInterest: {
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
    },
  },
  reasonUndecided: {
    'ui:title': 'Reason for being unsure or uninterested',
    'ui:widget': 'text',
    'ui:options': {
      labels: {
        phone: 'Phone',
        email: 'Email',
      },
      hideIf: formData => {
        return (
          formData.vaccineInterest === 'INTERESTED' ||
          formData.vaccineInterest === 'ALREADY_VACCINATED'
        );
      },
      expandUnder: 'vaccineInterest',
    },
  },
  // preferredFacility: {
  //   'ui:title':
  //     'Please select where you’d like to receive the COVID-19 vaccine.',
  //   'ui:widget': SelectFacilityWidget,
  //   'ui:required': formData => formData.vaccineInterest === 'INTERESTED',
  //   'ui:options': {
  //     expandUnder: 'vaccineInterest',
  //     // hideIf: formData => formData.vaccineInterest !== 'INTERESTED',
  //   },
  // },
};
