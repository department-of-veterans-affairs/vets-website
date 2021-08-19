import _ from 'platform/utilities/data';
import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';

import { eligiblePrograms, checkBenefit } from '../content/stemEligibility';

const {
  isEnrolledStem,
  isPursuingTeachingCert,
  isPursuingClinicalTraining,
  benefitLeft,
} = fullSchema10203.properties;

export const uiSchema = {
  'ui:title': 'Rogers STEM Scholarship eligibility',
  isEnrolledStem: {
    'ui:title':
      'Are you enrolled in a science, technology, engineering, or math (STEM) degree program?',
    'ui:description': eligiblePrograms,
    'ui:widget': 'yesNo',
  },

  'view:teachingCertClinicalTraining': {
    // prod flags 24612
    isPursuingTeachingCert: {
      'ui:title':
        'Do you have a STEM undergraduate degree and are now working toward a teaching certification?',
      'ui:widget': 'yesNo',
      'ui:required': formData => !formData.isEnrolledStem,
    },
    // prod flags 24612
    isPursuingClinicalTraining: {
      'ui:title':
        "Do you have a STEM bachelor's or graduate degree and are now pursuing a covered clinical training program for health care professionals?",
      'ui:description': eligiblePrograms,
      'ui:widget': 'yesNo',
      'ui:required': formData =>
        _.get(
          'view:teachingCertClinicalTraining.isPursuingTeachingCert',
          formData,
          false,
        ) === false && !formData.isEnrolledStem,
      'ui:options': {
        expandUnder: 'isPursuingTeachingCert',
        expandUnderCondition: false,
      },
    },
    'ui:options': {
      expandUnder: 'isEnrolledStem',
      expandUnderCondition: false,
    },
  },

  benefitLeft: {
    'ui:title': 'About how much of your education benefit do you have left?',
    'ui:description': checkBenefit,
    'ui:options': {
      labels: {
        moreThanSixMonths: 'More than 6 months',
        sixMonthsOrLess: '6 months or less',
        none: "None. I've used all of my education benefit.",
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
    'view:teachingCertClinicalTraining': {
      type: 'object',
      properties: {
        isPursuingTeachingCert,
        isPursuingClinicalTraining,
      },
    },
    benefitLeft,
  },
};
