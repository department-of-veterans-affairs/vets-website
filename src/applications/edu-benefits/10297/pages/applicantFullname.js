import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isValidYear } from 'platform/forms-system/src/js/utilities/validations';
import AgeEligibility from '../components/AgeEligibility';
import PersonalInformation from '../components/PersonalInformation';
import { getAgeInYears } from '../helpers';

const uiSchema = {
  'ui:description': PersonalInformation,
  applicantFullName: {
    ...fullNameNoSuffixUI(),
    'ui:options': {
      hideIf: () => true,
    },
  },
  dateOfBirth: {
    ...dateOfBirthUI({
      title: 'What is your date of birth?',
      errorMessages: { required: 'Please enter date of birth' },
    }),
    'ui:options': {
      hideIf: () => true,
    },
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
};

const schema = {
  type: 'object',
  properties: {
    applicantFullName: {
      ...fullNameNoSuffixSchema,
      required: [],
    },
    dateOfBirth: dateOfBirthSchema,
    eligibilityAlert: { type: 'object', properties: {} },
  },
  // required: ['applicantFullName', 'dateOfBirth'],
};

export { schema, uiSchema };
