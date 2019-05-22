import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import _ from 'lodash';
import {
  highTechIndustryDescription,
  highTechnologyEmploymentTypeDescription,
} from '../content/highTechIndustry';

const {
  currentHighTechnologyEmployment,
  pastHighTechnologyEmployment,
  currentSalary,
} = fullSchema.properties;

export const uiSchema = {
  'ui:description': highTechIndustryDescription,
  currentHighTechnologyEmployment: {
    'ui:title':
      'Are you working in one or more of these high-tech industries now?',
    'ui:widget': 'yesNo',
  },
  pastHighTechnologyEmployment: {
    'ui:title':
      'Have you worked in any of these high-tech industries in the past?',
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
      expandUnder: 'currentHighTechnologyEmployment',
      expandUnderCondition: () => true,
      hideIf: formData =>
        !(
          _.get(formData, 'currentHighTechnologyEmployment', false) ||
          (!_.get(formData, 'currentHighTechnologyEmployment', false) &&
            _.get(formData, 'pastHighTechnologyEmployment', false))
        ),
    },
    currentSalary: {
      'ui:title':
        'About how much a year do you or have you earned as a high-tech worker?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          lessThanTwenty: 'Less than $20,000',
          twentyToThirtyFive: '$20,000-$35,000',
          thirtyFiveToFifty: '$35,000-$50,000',
          fiftyToSeventyFive: '$50,000-$75,000',
          moreThanSeventyFive: 'More than $75,000',
        },
      },
    },
    highTechnologyEmploymentType: {
      'ui:title': ' ',
      'ui:description': highTechnologyEmploymentTypeDescription,
      computerProgramming: {
        'ui:title': 'Computer programming',
      },
      dataProcessing: {
        'ui:title': 'Data processing',
      },
      computerSoftware: {
        'ui:title': 'Computer software',
      },
      informationSciences: {
        'ui:title': 'Information sciences',
      },
      mediaApplication: {
        'ui:title': 'Media application',
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
          },
        },
      },
    },
  },
};
