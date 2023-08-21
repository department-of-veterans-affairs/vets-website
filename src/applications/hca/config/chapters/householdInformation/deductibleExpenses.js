import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import set from 'platform/utilities/data/set';

import { DeductibleExpensesDescription } from '../../../components/FormDescriptions';
import { ExpensesWarning } from '../../../components/FormAlerts';
import { expensesLessThanIncome } from '../../../utils/helpers';
import { emptyObjectSchema } from '../../../definitions';
import { validateCurrency } from '../../../utils/validation';

const {
  deductibleEducationExpenses,
  deductibleFuneralExpenses,
  deductibleMedicalExpenses,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Previous calendar year\u2019s deductible expenses',
    'ui:description': DeductibleExpensesDescription,
    deductibleMedicalExpenses: set(
      'ui:validations',
      [validateCurrency],
      currencyUI(
        'Amount you or your spouse paid in non-reimbursable medical expenses this past year.',
      ),
    ),
    'view:expensesIncomeWarning1': {
      'ui:description': ExpensesWarning,
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
      'ui:description': ExpensesWarning,
      'ui:options': {
        hideIf: expensesLessThanIncome('deductibleFuneralExpenses'),
      },
    },
    deductibleEducationExpenses: currencyUI(
      'Amount you paid for anything related to your own education (college or vocational) this past year. Do not list your dependents’ educational expenses.',
    ),
    'view:expensesIncomeWarning3': {
      'ui:description': ExpensesWarning,
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
