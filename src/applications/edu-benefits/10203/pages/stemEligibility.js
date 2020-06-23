import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';

import { benefitLeftDescription } from '../content/stemEligibility';

const {
  isEnrolledStem,
  isPursuingTeachingCert,
  benefitLeft,
} = fullSchema10203.properties;

export const uiSchema = {
  'ui:title': 'Rogers STEM Scholarship eligibility',
  isEnrolledStem: {
    'ui:title':
      'Are you enrolled in a science, technology, engineering, or math (STEM) undergraduate degree?',
    'ui:widget': 'yesNo',
  },
  isPursuingTeachingCert: {
    'ui:title':
      'Do you have a STEM undergraduate degree and are now pursuing a teaching certification?',
    'ui:widget': 'yesNo',
    'ui:required': formData => !formData.isEnrolledStem,
    'ui:options': {
      expandUnder: 'isEnrolledStem',
      expandUnderCondition: false,
    },
  },
  benefitLeft: {
    'ui:title': 'About how much of your education benefit do you have left?',
    'ui:description': benefitLeftDescription,
    'ui:options': {
      labels: {
        moreThanSixMonths: 'More than 6 months',
        sixMonthsOrLess: '6 months or less',
        none: "None, I've used it all",
      },
    },
    'ui:widget': 'radio',
  },
};

export const schema = {
  type: 'object',
  required: ['isEnrolledStem', 'benefitLeft'],
  properties: {
    isEnrolledStem,
    isPursuingTeachingCert,
    benefitLeft,
  },
};
