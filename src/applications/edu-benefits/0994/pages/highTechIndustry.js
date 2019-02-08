import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import _ from 'lodash';

const {
  currentHighTechnologyEmployment,
  pastHighTechnologyEmployment,
  currentSalary,
} = fullSchema.properties;

export const uiSchema = {
  'ui:description':
    'To give us an idea of your experience in the high-tech industry, please tell us about your work history',
  currentHighTechnologyEmployment: {
    'ui:title': 'Are you working in a high-tech industry now?',
    'ui:widget': 'yesNo',
  },
  pastHighTechnologyEmployment: {
    'ui:title': 'Have you worked in a high-tech industry in the past?',
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'currentHighTechnologyEmployment',
      expandUnderCondition: false,
    },
    'ui:required': formData =>
      !_.get(formData, 'currentHighTechnologyEmployment', false),
  },
  'view:salaryEmploymentTypes': {
    'ui:options': {
      hideIf: formData =>
        !(
          _.get(formData, 'currentHighTechnologyEmployment', false) ||
          (!_.get(formData, 'currentHighTechnologyEmployment', false) &&
            _.get(formData, 'pastHighTechnologyEmployment', false))
        ),
    },
    currentSalary: {
      'ui:title':
        'About how much per year do/did you earn as a high-tech worker?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          lessThanTwenty: 'Less than $20,000',
          twentyToThirtyFive: '$20,000 - $35,000',
          thirtyFiveToFifty: '$35,000 - $50,000',
          fiftyToSeventyFive: '$50,000 - $75,000',
          moreThanSeventyFive: 'More than $75,000',
        },
      },
    },
    highTechnologyEmploymentType: {
      'ui:description':
        'Which option(s) best describe your high-tech work experience? Check all that apply.',
      computerProgramming: {
        'ui:title': 'Computer Programming',
      },
      dataProcessing: {
        'ui:title': 'Data Processing',
      },
      computerSoftware: {
        'ui:title': 'Computer Software',
      },
      informationSciences: {
        'ui:title': 'Information Sciences',
      },
      mediaApplication: {
        'ui:title': 'Media Application',
      },
      noneApply: {
        'ui:title': 'None of these apply',
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['currentHighTechnologyEmployment', 'pastHighTechnologyEmployment'],
  properties: {
    currentHighTechnologyEmployment,
    pastHighTechnologyEmployment,
    'view:salaryEmploymentTypes': {
      type: 'object',
      properties: {
        currentSalary,
        highTechnologyEmploymentType: {
          type: 'object',
          properties: {
            computerProgramming: { type: 'boolean' },
            dataProcessing: { type: 'boolean' },
            computerSoftware: { type: 'boolean' },
            informationSciences: { type: 'boolean' },
            mediaApplication: { type: 'boolean' },
            noneApply: { type: 'boolean' },
          },
        },
      },
    },
  },
};
