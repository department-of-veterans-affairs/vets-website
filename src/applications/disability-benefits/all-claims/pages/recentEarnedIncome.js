import _ from 'lodash';
import { grossIncomeAdditionalInfo } from '../content/recentEarnedIncome';
import currencyUI from 'us-forms-system/lib/js/definitions/currency';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const currentMonthlyEarnedIncomeCurrency = currencyUI(
  "What's your current gross monthly income?",
);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
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
      ...currentMonthlyEarnedIncomeCurrency,
      'ui:options': {
        ...currentMonthlyEarnedIncomeCurrency['ui:options'],
        expandUnder: 'view:isEmployed',
      },
    },
    leftLastJobDueToDisability: {
      'ui:title':
        'Did you leave your job or have you stopped working because of your disability?',
      'ui:widget': 'yesNo',
      'ui:options': {
        expandUnder: 'view:isEmployed',
        expandUnderCondition: false,
      },
    },
    leftLastJobDueToDisabilityRemarks: {
      'ui:title':
        'Please describe in detail how your disability prevents you from holding down a steady job.',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 32000,
        hideIf: formData => {
          const isEmployed = _.get(
            formData,
            'unemployability.view:isEmployed',
            true,
          );
          const leftLastJob = _.get(
            formData,
            'unemployability.leftLastJobDueToDisability',
            false,
          );
          return isEmployed || (!isEmployed && !leftLastJob);
        },
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
        currentMonthlyEarnedIncome: {
          type: 'number',
          minimum: 0,
          maximum: 9999999.99,
        },
        leftLastJobDueToDisability: {
          type: 'boolean',
        },
        leftLastJobDueToDisabilityRemarks: {
          type: 'string',
        },
      },
    },
  },
};
