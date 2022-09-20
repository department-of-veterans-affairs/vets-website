import set from 'platform/utilities/data/set';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import {
  deductibleExpensesDescription,
  expensesGreaterThanIncomeWarning,
  expensesLessThanIncome,
} from '../../../helpers';

import { validateCurrency } from '../../../validation';

const {
  deductibleEducationExpenses,
  deductibleFuneralExpenses,
  deductibleMedicalExpenses,
} = fullSchemaHca.properties;

const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

export default {
  uiSchema: {
    'ui:title': 'Previous Calendar Year\u2019s Deductible Expenses',
    'ui:description': deductibleExpensesDescription,
    deductibleMedicalExpenses: set(
      'ui:validations',
      [validateCurrency],
      currencyUI(
        'Amount you or your spouse paid in non-reimbursable medical expenses this past year.',
      ),
    ),
    'view:expensesIncomeWarning1': {
      'ui:description': expensesGreaterThanIncomeWarning,
      'ui:options': {
        hideIf: expensesLessThanIncome('deductibleMedicalExpenses'),
      },
    },
    deductibleFuneralExpenses: set(
      'ui:validations',
      [validateCurrency],
      currencyUI(
        'Amount you paid in funeral or burial expenses for a deceased spouse or child this past year.',
      ),
    ),
    'view:expensesIncomeWarning2': {
      'ui:description': expensesGreaterThanIncomeWarning,
      'ui:options': {
        hideIf: expensesLessThanIncome('deductibleFuneralExpenses'),
      },
    },
    deductibleEducationExpenses: currencyUI(
      'Amount you paid for anything related to your own education (college or vocational) this past year. Do not list your dependents’ educational expenses.',
    ),
    'view:expensesIncomeWarning3': {
      'ui:description': expensesGreaterThanIncomeWarning,
      'ui:options': {
        hideIf: expensesLessThanIncome('deductibleEducationExpenses'),
      },
    },
  },
  schema: {
    type: 'object',
    required: [
      'deductibleMedicalExpenses',
      'deductibleFuneralExpenses',
      'deductibleEducationExpenses',
    ],
    properties: {
      deductibleMedicalExpenses,
      'view:expensesIncomeWarning1': emptyObjectSchema,
      deductibleFuneralExpenses,
      'view:expensesIncomeWarning2': emptyObjectSchema,
      deductibleEducationExpenses,
      'view:expensesIncomeWarning3': emptyObjectSchema,
    },
  },
};
