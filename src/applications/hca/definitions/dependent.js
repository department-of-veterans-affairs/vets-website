import { merge, pick } from 'lodash';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';
import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import {
  validateCurrency,
  validateDependentDate,
  validateV2DependentDate,
} from '../utils/validation';
import {
  DependentSupportDescription,
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../components/FormDescriptions';

/**
 * NOTE: for household v1 only
 * Remove everything between here and the v2 note when fully-adopted
 */
const incomeFields = ['grossIncome', 'netIncome', 'otherIncome'];

export const createDependentSchema = dependent => {
  const schema = merge({}, dependent, {
    required: [
      'dependentRelation',
      'socialSecurityNumber',
      'dateOfBirth',
      'becameDependent',
      'disabledBefore18',
      'cohabitedLastYear',
    ],
  });
  schema.properties = omit(incomeFields, schema.properties);
  return schema;
};

export const createDependentIncomeSchema = dependent => {
  return {
    ...dependent,
    properties: pick(dependent.properties, incomeFields),
    required: incomeFields,
  };
};

export const uiSchema = {
  'ui:order': [
    'fullName',
    'dependentRelation',
    'socialSecurityNumber',
    // Put the birth date before dependent date; it’s opposite in the schema
    'dateOfBirth',
    'becameDependent',
    'disabledBefore18',
    'attendedSchoolLastYear',
    'dependentEducationExpenses',
    'cohabitedLastYear',
    'receivedSupportLastYear',
  ],
  fullName: {
    ...fullNameUI,
    first: {
      'ui:title': 'Dependent\u2019s first name',
    },
    last: {
      'ui:title': 'Dependent\u2019s last name',
    },
    middle: {
      'ui:title': 'Dependent\u2019s middle name',
    },
    suffix: {
      'ui:title': 'Dependent\u2019s suffix',
    },
  },
  dependentRelation: {
    'ui:title': 'What\u2019s your dependent\u2019s relationship to you?',
  },
  socialSecurityNumber: {
    ...ssnUI,
    'ui:title': 'Dependent\u2019s Social Security number',
  },
  dateOfBirth: currentOrPastDateUI('Dependent’s date of birth'),
  becameDependent: {
    ...currentOrPastDateUI('When did they become your dependent?'),
    'ui:validations': [validateDependentDate],
  },
  disabledBefore18: {
    'ui:title':
      'Was your dependent permanently and totally disabled before the age of 18?',
    'ui:widget': 'yesNo',
  },
  attendedSchoolLastYear: {
    'ui:title':
      'If your dependent is between 18 and 23 years of age, did they attend school during the last calendar year?',
    'ui:widget': 'yesNo',
  },
  dependentEducationExpenses: {
    ...currencyUI(
      'Expenses your dependent paid for college, vocational rehabilitation, or training (e.g., tuition, books, materials)',
    ),
    'ui:required': () => true,
  },
  cohabitedLastYear: {
    'ui:title': 'Did your dependent live with you last year?',
    'ui:widget': 'yesNo',
  },
  receivedSupportLastYear: {
    'ui:title':
      'If your dependent didn’t live with you last year, did you provide support? (Please count all support contributions even if they weren’t paid in regular and set amounts. Support can include tuition or medical bill payments.)',
    'ui:widget': 'yesNo',
    // TODO: Fix this once the bug mentioned below is fixed
    // Hide by default, only showing after hideIf is run and overrides this
    'ui:hidden': true,
    'ui:options': {
      // Not being invoked until the data is changed...which means this is open
      //  by default
      hideIf: (formData, index) =>
        get(`dependents[${index}].cohabitedLastYear`, formData) !== false,
    },
  },
};

export const dependentIncomeUiSchema = {
  grossIncome: currencyUI(
    'Dependent\u2019s gross annual income from employment',
  ),
  netIncome: currencyUI(
    'Dependent\u2019s net income from farm, ranch, property or business',
  ),
  otherIncome: currencyUI('Dependent\u2019s other income amount'),
  'ui:options': {
    updateSchema: (formData, schema, ui, index) => {
      const name = get(`dependents.[${index}].fullName`, formData);
      if (name) {
        return {
          title: `${name.first} ${name.last} income`,
        };
      }

      return schema;
    },
  },
};

/**
 * NOTE: for household v2 only -- rename, if needed, when v2 is fully-adopted
 */

const date = new Date();
const lastYear = date.getFullYear() - 1;

// define uiSchemas for each page in dependent flow
export const dependentUISchema = {
  basic: {
    fullName: {
      ...fullNameUI,
      first: {
        'ui:title': 'Dependent\u2019s first name',
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
      },
      middle: {
        'ui:title': 'Dependent\u2019s middle name',
      },
      last: {
        'ui:title': 'Dependent\u2019s last name',
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
      },
      suffix: {
        'ui:title': 'Dependent\u2019s suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
        },
      },
    },
    dependentRelation: {
      'ui:title': 'What is the dependent\u2019s relationship to you?',
    },
    socialSecurityNumber: {
      ...ssnUI,
      'ui:title': 'Dependent\u2019s Social Security number',
    },
    dateOfBirth: currentOrPastDateUI('Dependent\u2019s date of birth'),
    becameDependent: {
      ...currentOrPastDateUI('When did they become your dependent?'),
      'ui:validations': [validateV2DependentDate],
    },
  },
  education: {
    attendedSchoolLastYear: {
      'ui:title': `If your dependent is between 18 and 23 years old, were they enrolled as a full-time or part-time student in ${lastYear}?`,
      'ui:widget': 'yesNo',
    },
    dependentEducationExpenses: {
      ...currencyUI(
        'Enter the total amount of money your dependent paid for college, vocational rehabilitation, or training (like tuition, book, or supplies)',
      ),
      'ui:validations': [validateCurrency],
    },
  },
  additional: {
    disabledBefore18: {
      'ui:title':
        'Is your dependent living with a permanent disability that happened before they turned 18 years old?',
      'ui:widget': 'yesNo',
    },
    cohabitedLastYear: {
      'ui:title': `Did your dependent live with you in ${lastYear}?`,
      'ui:widget': 'yesNo',
    },
    'view:dependentIncome': {
      'ui:title': `Did your dependent earn income in ${lastYear}?`,
      'ui:widget': 'yesNo',
    },
  },
  support: {
    receivedSupportLastYear: {
      'ui:title': `If your dependent didn\u2019t live with you in ${lastYear}, did you provide financial support?`,
      'ui:description': DependentSupportDescription,
      'ui:widget': 'yesNo',
    },
  },
  income: {
    'view:grossIncome': {
      'ui:title': 'Gross income from work',
      'ui:description': GrossIncomeDescription,
      grossIncome: {
        ...currencyUI(
          `Enter your dependent\u2019s gross annual income from ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:netIncome': {
      'ui:title': 'Net income from a farm, property, or business',
      'ui:description':
        'Net income is income after any taxes and other deductions are subtracted.',
      netIncome: {
        ...currencyUI(
          `Enter your dependent\u2019s net annual income from a farm, ranch, property or business from ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
        'ui:required': () => true,
      },
    },
    'view:otherIncome': {
      'ui:title': 'Other income',
      'ui:description': OtherIncomeDescription,
      otherIncome: {
        ...currencyUI(
          `Enter your dependent\u2019s other annual income from ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
        'ui:required': () => true,
      },
    },
  },
};

// definte schemas for each page in dependent flow
export const dependentSchema = {
  basic: {
    type: 'object',
    required: [
      'dependentRelation',
      'socialSecurityNumber',
      'dateOfBirth',
      'becameDependent',
    ],
    properties: {
      fullName: {
        type: 'object',
        required: ['first', 'last'],
        properties: {
          first: {
            type: 'string',
            minLength: 1,
            maxLength: 25,
            pattern: '^.*\\S.*',
          },
          middle: {
            type: 'string',
            maxLength: 30,
          },
          last: {
            type: 'string',
            minLength: 2,
            maxLength: 35,
            pattern: '^.*\\S.*',
          },
          suffix: {
            type: 'string',
            enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
          },
        },
      },
      dependentRelation: {
        type: 'string',
        enum: [
          'Daughter',
          'Son',
          'Stepson',
          'Stepdaughter',
          'Father',
          'Mother',
          'Spouse',
          'Other',
        ],
      },
      socialSecurityNumber: {
        type: 'string',
        pattern: '^[0-9]{9}$',
      },
      dateOfBirth: {
        type: 'string',
        format: 'date',
      },
      becameDependent: {
        type: 'string',
        format: 'date',
      },
    },
  },
  education: {
    type: 'object',
    required: ['dependentEducationExpenses'],
    properties: {
      attendedSchoolLastYear: {
        type: 'boolean',
      },
      dependentEducationExpenses: {
        type: 'number',
        minimum: 0,
        maximum: 9999999.99,
      },
    },
  },
  additional: {
    type: 'object',
    required: ['disabledBefore18', 'cohabitedLastYear', 'view:dependentIncome'],
    properties: {
      disabledBefore18: {
        type: 'boolean',
      },
      cohabitedLastYear: {
        type: 'boolean',
      },
      'view:dependentIncome': {
        type: 'boolean',
      },
    },
  },
  support: {
    type: 'object',
    properties: {
      receivedSupportLastYear: {
        type: 'boolean',
      },
    },
  },
  income: {
    type: 'object',
    properties: {
      'view:grossIncome': {
        type: 'object',
        required: ['grossIncome'],
        properties: {
          grossIncome: {
            type: 'number',
            minimum: 0,
            maximum: 9999999.99,
          },
        },
      },
      'view:netIncome': {
        type: 'object',
        required: ['netIncome'],
        properties: {
          netIncome: {
            type: 'number',
            minimum: 0,
            maximum: 9999999.99,
          },
        },
      },
      'view:otherIncome': {
        type: 'object',
        required: ['otherIncome'],
        properties: {
          otherIncome: {
            type: 'number',
            minimum: 0,
            maximum: 9999999.99,
          },
        },
      },
    },
  },
};
