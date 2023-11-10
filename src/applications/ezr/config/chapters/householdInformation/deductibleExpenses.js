import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { validateCurrency } from '../../../utils/validation';
import {
  EducationalExpensesDescription,
  MedicalExpensesDescription,
} from '../../../components/FormDescriptions/ExpensesDescriptions';
import { replaceStrValues } from '../../../utils/helpers/general';
import content from '../../../locales/en/content.json';

const {
  deductibleMedicalExpenses,
  deductibleEducationExpenses,
  deductibleFuneralExpenses,
} = ezrSchema.properties;

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    ...titleUI(
      replaceStrValues(content['household-expenses-title'], lastYear),
      content['household-expenses-description'],
    ),
    'view:deductibleMedicalExpenses': {
      'ui:title': content['household-expenses-medical-title'],
      'ui:description': MedicalExpensesDescription,
      deductibleMedicalExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-expenses-medical-label'],
            lastYear,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:deductibleEducationExpenses': {
      'ui:title': content['household-expenses-education-title'],
      'ui:description': EducationalExpensesDescription,
      deductibleEducationExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-expenses-education-label'],
            lastYear,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:deductibleFuneralExpenses': {
      'ui:title': content['household-expenses-funeral-title'],
      'ui:description': content['household-expenses-funeral-description'],
      deductibleFuneralExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-expenses-funeral-label'],
            lastYear,
          ),
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
        properties: { deductibleMedicalExpenses },
      },
      'view:deductibleEducationExpenses': {
        type: 'object',
        required: ['deductibleEducationExpenses'],
        properties: { deductibleEducationExpenses },
      },
      'view:deductibleFuneralExpenses': {
        type: 'object',
        required: ['deductibleFuneralExpenses'],
        properties: { deductibleFuneralExpenses },
      },
    },
  },
};
