import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import _ from 'lodash';
import { highTechIndustryDescription } from '../content/highTechIndustry';

const {
  currentHighTechnologyEmployment,
  pastHighTechnologyEmployment,
  currentSalary,
} = fullSchema.properties;

const HIGH_TECH_EMPLOYMENT_TYPES = {
  COMPUTER_PROGRAMMING: 'computerProgramming',
  COMPUTER_SOFTWARE: 'computerSoftware',
  DATA_PROCESSING: 'dataProcessing',
  INFORMATION_SCIENCES: 'informationSciences',
  MEDIA_APPLICATION: 'mediaApplication',
  NONE_APPLY: 'noneApply',
};

const typeCount = types => {
  let count = 0;
  Object.values(types).forEach(value => {
    if (value) {
      count += 1;
    }
  });
  return count;
};

const undefinedCount = types => {
  let count = 0;
  Object.values(types).forEach(value => {
    if (typeof value === 'undefined' || value === null) {
      count += 1;
    }
  });
  return count;
};

const setUndefined = value => {
  if (value) {
    return value;
  }
  return null;
};

const getHighTechnologyEmploymentTypes = formData =>
  formData['view:salaryEmploymentTypes'].highTechnologyEmploymentType;

const clearValues = formData => {
  const types = getHighTechnologyEmploymentTypes(formData);
  for (const type of Object.entries(types).filter(e => e[0] !== 'noneApply')) {
    types[type[0]] = false;
  }
};

const setUndefinedValues = formData => {
  const types = getHighTechnologyEmploymentTypes(formData);
  for (const type of Object.entries(types).filter(e => e[0] !== 'noneApply')) {
    types[type[0]] = setUndefined(types[type[0]]);
  }
};

const validateNoneApply = (errors, fieldData, formData) => {
  const types = getHighTechnologyEmploymentTypes(formData);
  const count = typeCount(types);
  if (types.noneApply && (count > 2 || count === 1)) {
    clearValues(formData);
  } else if (types.noneApply && count === 2) {
    if (undefinedCount(types) > 0) {
      clearValues(formData);
    } else {
      types.noneApply = false;
      setUndefinedValues(formData);
    }
  }
};

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
      'ui:description':
        'Which area best describes your high-tech work experience? (Check all that apply.)',
      [HIGH_TECH_EMPLOYMENT_TYPES.COMPUTER_PROGRAMMING]: {
        'ui:title': 'Computer programming',
        'ui:validations': [validateNoneApply],
      },
      [HIGH_TECH_EMPLOYMENT_TYPES.DATA_PROCESSING]: {
        'ui:title': 'Data processing',
        'ui:validations': [validateNoneApply],
      },
      [HIGH_TECH_EMPLOYMENT_TYPES.COMPUTER_SOFTWARE]: {
        'ui:title': 'Computer software',
        'ui:validations': [validateNoneApply],
      },
      [HIGH_TECH_EMPLOYMENT_TYPES.INFORMATION_SCIENCES]: {
        'ui:title': 'Information sciences',
        'ui:validations': [validateNoneApply],
      },
      [HIGH_TECH_EMPLOYMENT_TYPES.MEDIA_APPLICATION]: {
        'ui:title': 'Media application',
        'ui:validations': [validateNoneApply],
      },
      [HIGH_TECH_EMPLOYMENT_TYPES.NONE_APPLY]: {
        'ui:title': 'None of these',
        'ui:validations': [validateNoneApply],
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
            [HIGH_TECH_EMPLOYMENT_TYPES.COMPUTER_PROGRAMMING]: {
              type: 'boolean',
            },
            [HIGH_TECH_EMPLOYMENT_TYPES.DATA_PROCESSING]: { type: 'boolean' },
            [HIGH_TECH_EMPLOYMENT_TYPES.COMPUTER_SOFTWARE]: { type: 'boolean' },
            [HIGH_TECH_EMPLOYMENT_TYPES.INFORMATION_SCIENCES]: {
              type: 'boolean',
            },
            [HIGH_TECH_EMPLOYMENT_TYPES.MEDIA_APPLICATION]: { type: 'boolean' },
            [HIGH_TECH_EMPLOYMENT_TYPES.NONE_APPLY]: { type: 'boolean' },
          },
        },
      },
    },
  },
};
