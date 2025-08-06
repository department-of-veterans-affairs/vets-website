import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import { validateCurrency } from '../../../utils/validation';
import { LAST_YEAR, replaceStrValues } from '../../../utils/helpers';
import { FULL_SCHEMA } from '../../../utils/imports';
import {
  EducationalExpensesDescription,
  MedicalExpensesDescription,
} from '../../../components/FormDescriptions';
import content from '../../../locales/en/content.json';

const {
  deductibleEducationExpenses,
  deductibleFuneralExpenses,
  deductibleMedicalExpenses,
} = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      replaceStrValues(content['household-info--expenses-title'], LAST_YEAR),
      content['household-info--expenses-description'],
    ),
    'view:deductibleMedicalExpenses': {
      'ui:title': content['household-info--expenses-medical-title'],
      ...descriptionUI(MedicalExpensesDescription),
      deductibleMedicalExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-info--expenses-medical-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:deductibleEducationExpenses': {
      'ui:title': content['household-info--expenses-education-title'],
      ...descriptionUI(EducationalExpensesDescription),
      deductibleEducationExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-info--expenses-education-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:deductibleFuneralExpenses': {
      'ui:title': content['household-info--expenses-funeral-title'],
      'ui:description': content['household-info--expenses-funeral-description'],
      deductibleFuneralExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-info--expenses-funeral-label'],
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
