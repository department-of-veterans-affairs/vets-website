import merge from 'lodash/merge';

import get from '@department-of-veterans-affairs/platform-forms-system/get';
import {
  radioUI,
  radioSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { VaTextInputField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import currencyUI from '@department-of-veterans-affairs/platform-forms-system/currency';

import { validateCurrency } from '../../../validation';
import { IncomeInformationAlert } from '../../../components/FormAlerts';
import { IncomeSourceDescription } from '../../../helpers';
import IncomeSourceView from '../../../components/IncomeSourceView';

const typeOfIncomeOptions = {
  SOCIAL_SECURITY: 'Social Security',
  INTEREST_DIVIDEND: 'Interest or dividend income',
  RETIREMENT: 'Retirement income',
  PENSION: 'Pension income',
  OTHER: 'Other income',
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Gross monthly income',
    'ui:description': IncomeSourceDescription,
    'view:informationAlert': {
      'ui:description': IncomeInformationAlert,
    },
    incomeSources: {
      'ui:options': {
        itemName: 'income source',
        viewField: IncomeSourceView,
        reviewTitle: 'Income sources',
      },
      items: {
        typeOfIncome: radioUI({
          title: 'What type of income?',
          labels: typeOfIncomeOptions,
        }),
        otherTypeExplanation: {
          'ui:title': 'Please specify',
          'ui:options': {
            expandUnder: 'typeOfIncome',
            expandUnderCondition: typeOfIncomeOptions.OTHER,
          },
          'ui:required': (form, index) =>
            get(['incomeSources', index, 'typeOfIncome'], form) ===
            typeOfIncomeOptions.OTHER,
        },
        receiver: {
          'ui:title': 'Who receives this income?',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            hint:
              'Enter your name, or the name of your spouse or one of your dependents.',
          },
        },
        payer: {
          'ui:title': 'Who pays this income?',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            hint:
              'Enter the name of a government agency, a company, or another organization.',
            classNames: 'vads-u-margin-bottom--2',
          },
        },
        amount: merge({}, currencyUI('What’s the monthly amount of income?'), {
          'ui:validations': [validateCurrency],
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:informationAlert': {
        type: 'object',
        properties: {},
      },
      incomeSources: {
        type: 'array',
        items: {
          type: 'object',
          required: ['typeOfIncome', 'receiver', 'payer', 'amount'],
          properties: {
            typeOfIncome: radioSchema(Object.values(typeOfIncomeOptions)),
            otherTypeExplanation: { type: 'string' },
            receiver: { type: 'string' },
            payer: { type: 'string' },
            amount: { type: 'number' },
          },
        },
      },
    },
  },
};
