import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { inlineTitleUI } from '../../../components/FormPatterns/TitlePatterns';
import { validateCurrency } from '../../../utils/validation';
import {
  EducationalExpensesDescription,
  MedicalExpensesDescription,
} from '../../../components/FormDescriptions/ExpensesDescriptions';
import { replaceStrValues } from '../../../utils/helpers/general';
import { LAST_YEAR } from '../../../utils/constants';
import content from '../../../locales/en/content.json';

const {
  deductibleMedicalExpenses,
  deductibleEducationExpenses,
  deductibleFuneralExpenses,
} = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(
      replaceStrValues(content['household-expenses-title'], LAST_YEAR),
      content['household-expenses-description'],
    ),
    'view:deductibleMedicalExpenses': {
      'ui:title': content['household-expenses-medical-title'],
      'ui:description': MedicalExpensesDescription,
      deductibleMedicalExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-expenses-medical-label'],
            LAST_YEAR,
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
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:deductibleFuneralExpenses': {
      ...inlineTitleUI(
        content['household-expenses-funeral-title'],
        content['household-expenses-funeral-description'],
      ),
      deductibleFuneralExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-expenses-funeral-label'],
            LAST_YEAR,
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
