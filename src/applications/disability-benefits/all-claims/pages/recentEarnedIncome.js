import { grossIncomeAdditionalInfo } from '../content/recentEarnedIncome';
import currencyUI from 'us-forms-system/lib/js/definitions/currency';

const currentMonthlyEarnedIncomeCurrency = currencyUI(
  "What's your current gross monthly income?",
);

export const uiSchema = {
  'ui:title': 'Recent earnings',
  unemployability: {
    past12MonthsEarnedIncome: currencyUI(
      'What was your gross income over the past 12 months?',
    ),
    'view:grossIncomeAdditionalInfo': {
      'ui:title': ' ',
      'ui:description': grossIncomeAdditionalInfo,
    },
    'view:isEmployed': {
      'ui:title': 'Are you employed now?',
      'ui:widget': 'yesNo',
    },
    currentMonthlyEarnedIncome: {
      ...currentMonthlyEarnedIncomeCurrency,
      'ui:options': {
        ...currentMonthlyEarnedIncomeCurrency['ui:options'],
        expandUnder: 'view:isEmployed',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        past12MonthsEarnedIncome: {
          type: 'number',
          minimum: 0,
          maximum: 9999999.99,
        },
        'view:grossIncomeAdditionalInfo': {
          type: 'object',
          properties: {},
        },
        'view:isEmployed': {
          type: 'boolean',
        },
        'view:currentMonthlyEarnedIncome': {
          type: 'object',
          properties: {},
        },
        currentMonthlyEarnedIncome: {
          type: 'number',
          minimum: 0,
          maximum: 9999999.99,
        },
      },
    },
  },
};
