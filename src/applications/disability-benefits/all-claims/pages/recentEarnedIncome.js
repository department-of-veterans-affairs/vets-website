import _ from 'lodash';
import { grossIncomeAdditionalInfo } from '../content/recentEarnedIncome';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import {
  unemployabilityTitle,
  unemployabilityPageTitle,
} from '../content/unemployabilityFormIntro';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const {
  past12MonthsEarnedIncome,
  currentMonthlyEarnedIncome,
  leftLastJobDueToDisability,
  leftLastJobDueToDisabilityRemarks,
} = fullSchema.properties.form8940.properties.unemployability.properties;

const currentMonthlyEarnedIncomeCurrency = currencyUI(
  "What's your current gross monthly income?",
);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  unemployability: {
    'ui:title': unemployabilityPageTitle('Recent earnings'),
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
        past12MonthsEarnedIncome,
        'view:grossIncomeAdditionalInfo': {
          type: 'object',
          properties: {},
        },
        'view:isEmployed': {
          type: 'boolean',
        },
        currentMonthlyEarnedIncome,
        leftLastJobDueToDisability,
        leftLastJobDueToDisabilityRemarks,
      },
    },
  },
};
