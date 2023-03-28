import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import { validateCurrency } from '../../../utils/validation';
import { DeductableExpensesAlert } from '../../../components/FormAlerts';
import { EducationalExpensesDescription } from '../../../components/FormDescriptions';

const {
  deductibleEducationExpenses,
  deductibleFuneralExpenses,
  deductibleMedicalExpenses,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Last year\u2019s deductible expenses',
    'ui:description': DeductableExpensesAlert,
    deductibleMedicalExpenses: {
      ...currencyUI(
        'Amount you or your spouse paid in non-reimbursable medical expenses this past year.',
      ),
      'ui:validations': [validateCurrency],
    },
    deductibleFuneralExpenses: {
      ...currencyUI(
        'Amount you paid in funeral or burial expenses for a deceased spouse or child this past year.',
      ),
      'ui:validations': [validateCurrency],
    },
    deductibleEducationExpenses: {
      ...currencyUI(
        'Amount you paid for anything related to your own college or vocational education this past year.',
      ),
      'ui:description': EducationalExpensesDescription,
      'ui:validations': [validateCurrency],
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
      deductibleFuneralExpenses,
      deductibleEducationExpenses,
    },
  },
};
