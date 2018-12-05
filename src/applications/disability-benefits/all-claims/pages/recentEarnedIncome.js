import { grossIncomeAdditionalInfo } from '../content/recentEarnedIncome';
import currencyUI from 'us-forms-system/lib/js/definitions/currency';

export const uiSchema = {
  'ui:title': 'Recent earnings',
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
    'ui:options': {
      expandUnder: 'view:isEmployed',
    },
    'ui:title': "What's your current gross monthly income?",
  },
};

export const schema = {
  type: 'object',
  properties: {
    past12MonthsEarnedIncome: {
      type: 'string',
    },
    'view:grossIncomeAdditionalInfo': {
      type: 'object',
      properties: {},
    },
    'view:isEmployed': {
      type: 'boolean',
    },
    currentMonthlyEarnedIncome: {
      type: 'string',
    },
  },
};
