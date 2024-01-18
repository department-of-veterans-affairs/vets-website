import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import { validateCurrency } from '../../../utils/validation';
import {
  DeductibleExpensesDescription,
  EducationalExpensesDescription,
  MedicalExpensesDescription,
} from '../../../components/FormDescriptions';

const {
  deductibleEducationExpenses,
  deductibleFuneralExpenses,
  deductibleMedicalExpenses,
} = fullSchemaHca.properties;

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    'ui:title': DeductibleExpensesDescription,
    'view:deductibleMedicalExpenses': {
      'ui:title': 'Non-reimbursable medical expenses',
      'ui:description': MedicalExpensesDescription,
      deductibleMedicalExpenses: {
        ...currencyUI(
          `Enter the amount you or your spouse (if you’re married) paid in non-reimbursable medical expenses in ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:deductibleEducationExpenses': {
      'ui:title': 'College or vocational education expenses',
      'ui:description': EducationalExpensesDescription,
      deductibleEducationExpenses: {
        ...currencyUI(
          `Enter the amount you paid for your own college or vocational education in ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:deductibleFuneralExpenses': {
      'ui:title':
        'Funeral and burial expenses for a spouse or dependent who died',
      'ui:description':
        'Funeral and burial expenses are any payments made by you, like prepaid expenses.',
      deductibleFuneralExpenses: {
        ...currencyUI(
          `Enter the amount you paid in funeral or burial expenses in ${lastYear}`,
        ),
        'ui:validations': [validateCurrency],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:deductibleMedicalExpenses': {
        type: 'object',
        required: ['deductibleMedicalExpenses'],
        properties: {
          deductibleMedicalExpenses,
        },
      },
      'view:deductibleEducationExpenses': {
        type: 'object',
        required: ['deductibleEducationExpenses'],
        properties: {
          deductibleEducationExpenses,
        },
      },
      'view:deductibleFuneralExpenses': {
        type: 'object',
        required: ['deductibleFuneralExpenses'],
        properties: {
          deductibleFuneralExpenses,
        },
      },
    },
  },
};
