import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import AgeEligibility from '../components/AgeEligibility';
import { getAgeInYears } from '../helpers';

const uiSchema = {
  ...titleUI('Name and date of birth'),
  applicantFullName: fullNameNoSuffixUI(),
  dateOfBirth: dateOfBirthUI({
    title: 'What is your date of birth?',
    errorMessages: { required: 'Enter date of birth' },
  }),
  eligibilityAlert: {
    title: '',
    'ui:description': AgeEligibility,
    'ui:options': {
      hideIf: formData => {
        const age = getAgeInYears(formData?.dateOfBirth);
        return !formData?.dateOfBirth || age <= 62;
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
  },
  required: ['applicantFullName', 'dateOfBirth'],
};

export { schema, uiSchema };
