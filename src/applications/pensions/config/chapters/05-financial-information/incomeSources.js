import merge from 'lodash/merge';

import get from 'platform/utilities/data/get';
import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';

import { validateCurrency } from '../../../validation';
import { IncomeInformationAlert } from '../../../components/FormAlerts';
import { IncomeSourceDescription } from '../../../helpers';
import { typeOfIncomeLabels } from '../../../labels';
import IncomeSourceView from '../../../components/IncomeSourceView';

const receiverOptions = {
  VETERAN: 'Veteran',
  SPOUSE: 'Spouse',
  DEPENDENT: 'Dependent',
};

export const otherExplanationRequired = (form, index) =>
  get(['incomeSources', index, 'typeOfIncome'], form) === 'OTHER';

export const dependentNameRequired = (form, index) =>
  get(['incomeSources', index, 'receiver'], form) === 'DEPENDENT';

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
        itemName: 'Income source',
        itemAriaLabel: data =>
          `${typeOfIncomeLabels[data.typeOfIncome]} income source`,
        viewField: IncomeSourceView,
        reviewTitle: 'Income sources',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
      },
      items: {
        typeOfIncome: radioUI({
          title: 'What type of income?',
          labels: typeOfIncomeLabels,
        }),
        otherTypeExplanation: {
          'ui:title': 'Please specify',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            expandUnder: 'typeOfIncome',
            expandUnderCondition: 'OTHER',
          },
          'ui:required': otherExplanationRequired,
        },
        receiver: radioUI({
          title: 'Who receives this income?',
          labels: receiverOptions,
        }),
        dependentName: {
          'ui:title': 'Which dependent?',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            expandUnder: 'receiver',
            expandUnderCondition: 'DEPENDENT',
          },
          'ui:required': dependentNameRequired,
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
        minItems: 1,
        items: {
          type: 'object',
          required: ['typeOfIncome', 'receiver', 'payer', 'amount'],
          properties: {
            typeOfIncome: radioSchema(Object.keys(typeOfIncomeLabels)),
            otherTypeExplanation: { type: 'string' },
            receiver: radioSchema(Object.keys(receiverOptions)),
            dependentName: { type: 'string' },
            payer: { type: 'string' },
            amount: { type: 'number' },
          },
        },
      },
    },
  },
};
