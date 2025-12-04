import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isValidYear } from 'platform/forms-system/src/js/utilities/validations';
import { validateCurrentOrPastMemorableDate } from 'platform/forms-system/src/js/validation.js';
import AgeEligibility from '../components/AgeEligibility';
import AgeEligibilityUnderEighteen from '../components/AgeEligibilityUnderEighteen';
import { getAgeInYears, validateDateOfBirth } from '../helpers';

const uiSchema = {
  ...titleUI('Name and date of birth'),
  applicantFullName: fullNameNoSuffixUI(),
  dateOfBirth: {
    ...dateOfBirthUI({
      title: 'What is your date of birth?',
      errorMessages: { required: 'Please enter date of birth' },
    }),
    'ui:validations': [validateCurrentOrPastMemorableDate, validateDateOfBirth],
  },
  eligibilityAlert: {
    title: '',
    'ui:description': AgeEligibility,
    'ui:options': {
      hideIf: formData => {
        const age = getAgeInYears(formData?.dateOfBirth);
        return (
          !formData?.dateOfBirth ||
          !isValidYear(new Date(formData?.dateOfBirth).getFullYear()) ||
          age <= 62
        );
      },
      preserveHiddenData: true,
    },
  },
  eligibilityAlertUnderEighteen: {
    title: '',
    'ui:description': AgeEligibilityUnderEighteen,
    'ui:options': {
      hideIf: formData => {
        const age = getAgeInYears(formData?.dateOfBirth);
        return (
          !formData?.dateOfBirth ||
          !isValidYear(new Date(formData?.dateOfBirth).getFullYear()) ||
          age > 17 ||
          age < 0
        );
      },
      preserveHiddenData: true,
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    applicantFullName: fullNameNoSuffixSchema,
    dateOfBirth: dateOfBirthSchema,
    eligibilityAlert: { type: 'object', properties: {} },
    eligibilityAlertUnderEighteen: { type: 'object', properties: {} },
  },
  required: ['applicantFullName', 'dateOfBirth'],
};

export { schema, uiSchema };
