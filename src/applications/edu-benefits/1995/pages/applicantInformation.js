import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { genderLabels } from '../../utils/labels';
import { SeventeenOrOlder } from '../../1990/helpers';

export const uiSchema = {
  veteranFullName: {
    first: {
      'ui:title': 'Your first name',
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
    },
    last: {
      'ui:title': 'Your last name',
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
    },
    middle: {
      'ui:title': 'Your middle name',
    },
    suffix: {
      'ui:title': 'Suffix',
      'ui:options': {
        widgetClassNames: 'form-select-medium',
      },
    },
  },
  veteranSocialSecurityNumber: {
    ...ssnUI,
    'ui:title': 'Social Security number',
    'ui:required': formData => !formData['view:noSSN'],
    'ui:errorMessages': {
      required: 'Please enter a Social Security number',
    },
  },
  'view:noSSN': {
    'ui:title': 'I don’t have a Social Security number',
    'ui:options': {
      hideOnReview: true,
    },
  },
  vaFileNumber: {
    'ui:required': formData => formData['view:noSSN'],
    'ui:title': 'VA file number',
    'ui:options': {
      expandUnder: 'view:noSSN',
    },
    'ui:errorMessages': {
      pattern: 'Your VA file number must be between 7 to 9 digits',
    },
  },
  dateOfBirth: {
    ...currentOrPastDateUI('Your date of birth'),
    'ui:errorMessages': {
      pattern: 'Please provide a valid date',
      required: 'Please enter a date',
      futureDate: 'Please provide a valid date',
    },
    'ui:validations': [
      (errors, dob) => {
        // If we have a complete date, check to make sure it’s a valid dob
        if (/\d{4}-\d{2}-\d{2}/.test(dob) && !SeventeenOrOlder(dob)) {
          errors.addError('You must be at least 17 to apply');
        }
      },
    ],
  },
  applicantGender: {
    'ui:widget': 'radio',
    'ui:title': 'Gender',
    'ui:options': {
      labels: genderLabels,
    },
  },
};
