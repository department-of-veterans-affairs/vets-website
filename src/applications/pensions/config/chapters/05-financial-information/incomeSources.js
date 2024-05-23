import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';
import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { IncomeInformationAlert } from '../../../components/FormAlerts';
import { IncomeSourceDescription } from '../../../helpers';
import { recipientTypeLabels, typeOfIncomeLabels } from '../../../labels';
import IncomeSourceView from '../../../components/IncomeSourceView';
import { doesReceiveIncome } from './helpers';

const {
  otherTypeExplanation,
  dependentName,
  payer,
  // Need to investigate default value issue
  // amount,
} = fullSchemaPensions.definitions.incomeSources.items.properties;

export const otherExplanationRequired = (form, index) =>
  get(['incomeSources', index, 'typeOfIncome'], form) === 'OTHER';

export const dependentNameRequired = (form, index) =>
  get(['incomeSources', index, 'receiver'], form) === 'DEPENDENT';

/** @type {PageSchema} */
export default {
  title: 'Gross monthly income',
  path: 'financial/income-sources',
  depends: doesReceiveIncome,
  uiSchema: {
    ...titleUI('Gross monthly income', IncomeSourceDescription),
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
        useVaCards: true,
        showSave: true,
        reviewMode: true,
      },
      items: {
        typeOfIncome: radioUI({
          title: 'What type of income?',
          labels: typeOfIncomeLabels,
        }),
        otherTypeExplanation: {
          'ui:title': 'Tell us the type of income',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            expandUnder: 'typeOfIncome',
            expandUnderCondition: 'OTHER',
          },
          'ui:required': otherExplanationRequired,
        },
        receiver: radioUI({
          title: 'Who receives this income?',
          labels: recipientTypeLabels,
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
          'ui:options': {
            classNames: 'schemaform-currency-input-v3',
          },
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
            otherTypeExplanation,
            receiver: radioSchema(Object.keys(recipientTypeLabels)),
            dependentName,
            payer,
            amount: {
              type: 'number',
            },
          },
        },
      },
    },
  },
};
