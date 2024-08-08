import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { validateCurrentOrFutureDate } from 'platform/forms-system/src/js/validation';
import { genderLabels } from '../../utils/labels';
import { ageWarning, isEighteenOrOlder } from '../helpers';

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
  },
  minorHighSchoolQuestions: {
    'ui:description': ageWarning,
    'ui:options': {
      // expandUnder: ['dateOfBirth'],
      hideIf: formData => isEighteenOrOlder(formData.dateOfBirth),
    },
    minorHighSchoolQuestion: {
      'ui:title': 'Applicant has graduated high school or received GED?',
      'ui:widget': 'yesNo',
      'ui:required': formData => !isEighteenOrOlder(formData.dateOfBirth),
    },
    highSchoolGedGradDate: {
      ...currentOrPastDateUI('Date graduated'),
      'ui:options': {
        expandUnder: 'minorHighSchoolQuestion',
      },
      'ui:required': formData => {
        let isRequired = false;
        if (!isEighteenOrOlder(formData.dateOfBirth)) {
          const yesNoResults =
            formData.minorHighSchoolQuestions.minorHighSchoolQuestion;
          if (yesNoResults) {
            isRequired = true;
          }
          if (!yesNoResults) {
            isRequired = false;
          }
        }
        return isRequired;
      },
    },
    highSchoolGedExpectedGradDate: {
      'ui:title': 'Date expected to graduate',
      'ui:widget': 'date',
      'ui:options': {
        expandUnder: 'minorHighSchoolQuestion',
        expandUnderCondition: false,
      },
      'ui:validations': [validateCurrentOrFutureDate],
      'ui:errorMessages': {
        pattern: 'Please enter a valid current or future date',
        required: 'Please enter a date',
      },
    },
  },
  applicantGender: {
    'ui:widget': 'radio',
    'ui:title': 'Gender',
    'ui:options': {
      labels: genderLabels,
    },
  },
};
