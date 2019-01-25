import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import _ from 'lodash';

const {
  currentEmployment,
  currentHighTechnologyEmployment,
  currentSalary,
  highTechnologyEmploymentType,
} = fullSchema.properties;

export const uiSchema = {
  'ui:description':
    'To give us an idea of your experience in the high-tech market, please tell us about your work and training.',
  currentEmployment: {
    'ui:title': 'Are you working in a high-tech industry now?',
    'ui:widget': 'yesNo',
  },
  currentHighTechnologyEmployment: {
    'ui:title':
      'Have you worked in a high-tech industry in the past couple years?',
    'ui:widget': 'yesNo',
    'ui:options': {
      expandUnder: 'currentEmployment',
      expandUnderCondition: false,
    },
    'ui:required': formData => !_.get(formData, 'currentEmployment', false),
  },
  'view:salaryEmploymentTypes': {
    'ui:options': {
      hideIf: formData => {
        const showIf =
          _.get(formData, 'currentEmployment', false) ||
          (!_.get(formData, 'currentEmployment', false) &&
            _.get(formData, 'currentHighTechnologyEmployment', false));

        return !showIf;
      },
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
      hasComputerProgramming: {
        'ui:title': 'Computer Programming',
      },
      hasDataProcessing: {
        'ui:title': 'Data Processing',
      },
      hasComputerSoftware: {
        'ui:title': 'Computer Software',
      },
      hasInformationSciences: {
        'ui:title': 'Information Sciences',
      },
      hasMediaApplication: {
        'ui:title': 'Media Application',
      },
      hasNoneApply: {
        'ui:title': 'None of these apply',
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['currentEmployment', 'currentHighTechnologyEmployment'],
  properties: {
    currentEmployment,
    currentHighTechnologyEmployment,
    'view:salaryEmploymentTypes': {
      type: 'object',
      properties: {
        currentSalary,
        highTechnologyEmploymentType,
      },
    },
  },
};
