import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { validateCurrency, validateDependentDate } from '../utils/validation';
import { LAST_YEAR } from '../utils/constants';
import { FULL_SCHEMA } from '../utils/imports';
import {
  DependentEducationExpensesDescription,
  DependentSupportDescription,
  GrossIncomeDescription,
  OtherIncomeDescription,
} from '../components/FormDescriptions';

const {
  dependents: {
    items: { properties: dependent },
  },
} = FULL_SCHEMA.properties;

// define uiSchemas for each page in dependent flow
export const dependentUISchema = {
  basic: {
    fullName: {
      first: {
        ...fullNameUI.first,
        'ui:title': 'Dependent\u2019s first name',
      },
      middle: {
        ...fullNameUI.middle,
        'ui:title': 'Dependent\u2019s middle name',
      },
      last: {
        ...fullNameUI.last,
        'ui:title': 'Dependent\u2019s last name',
      },
      suffix: {
        ...fullNameUI.suffix,
        'ui:title': 'Dependent\u2019s suffix',
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
      'ui:validations': [validateDependentDate],
    },
  },
  education: {
    attendedSchoolLastYear: {
      'ui:title': `If your dependent is between 18 and 23 years old, were they enrolled as a full-time or part-time student in ${LAST_YEAR}?`,
      'ui:widget': 'yesNo',
    },
    dependentEducationExpenses: {
      ...currencyUI(
        'Enter the total amount of money your dependent paid for college, vocational rehabilitation, or training (like tuition, books, or supplies)',
      ),
      'ui:description': DependentEducationExpensesDescription,
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
      'ui:title': `Did your dependent live with you in ${LAST_YEAR}?`,
      'ui:widget': 'yesNo',
    },
    'view:dependentIncome': {
      'ui:title': `Did your dependent earn income in ${LAST_YEAR}?`,
      'ui:widget': 'yesNo',
    },
  },
  support: {
    receivedSupportLastYear: {
      'ui:title': `If your dependent didn\u2019t live with you in ${LAST_YEAR}, did you provide any financial support?`,
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
          `Enter your dependent\u2019s gross annual income from ${LAST_YEAR}`,
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
          `Enter your dependent\u2019s net annual income from a farm, ranch, property or business from ${LAST_YEAR}`,
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:otherIncome': {
      'ui:title': 'Other income',
      'ui:description': OtherIncomeDescription,
      otherIncome: {
        ...currencyUI(
          `Enter your dependent\u2019s other annual income from ${LAST_YEAR}`,
        ),
        'ui:validations': [validateCurrency],
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
      fullName: dependent.fullName,
      dependentRelation: dependent.dependentRelation,
      socialSecurityNumber: dependent.socialSecurityNumber,
      dateOfBirth: dependent.dateOfBirth,
      becameDependent: dependent.becameDependent,
    },
  },
  education: {
    type: 'object',
    required: ['dependentEducationExpenses'],
    properties: {
      attendedSchoolLastYear: dependent.attendedSchoolLastYear,
      dependentEducationExpenses: dependent.dependentEducationExpenses,
    },
  },
  additional: {
    type: 'object',
    required: ['disabledBefore18', 'cohabitedLastYear', 'view:dependentIncome'],
    properties: {
      disabledBefore18: dependent.disabledBefore18,
      cohabitedLastYear: dependent.cohabitedLastYear,
      'view:dependentIncome': {
        type: 'boolean',
      },
    },
  },
  support: {
    type: 'object',
    properties: {
      receivedSupportLastYear: dependent.receivedSupportLastYear,
    },
  },
  income: {
    type: 'object',
    properties: {
      'view:grossIncome': {
        type: 'object',
        required: ['grossIncome'],
        properties: {
          grossIncome: dependent.grossIncome,
        },
      },
      'view:netIncome': {
        type: 'object',
        required: ['netIncome'],
        properties: {
          netIncome: dependent.netIncome,
        },
      },
      'view:otherIncome': {
        type: 'object',
        required: ['otherIncome'],
        properties: {
          otherIncome: dependent.otherIncome,
        },
      },
    },
  },
};
