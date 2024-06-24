import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import get from 'platform/utilities/data/get';
import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  radioUI,
  radioSchema,
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VaTextInputField,
  VaCheckboxField,
} from 'platform/forms-system/src/js/web-component-fields';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import ListItemView from '../../../components/ListItemView';
import { recipientTypeLabels } from '../../../labels';
import { doesHaveCareExpenses } from './helpers';
import ArrayDescription from '../../../components/ArrayDescription';

const {
  childName,
  provider,
  ratePerHour,
  noCareEndDate,
  paymentAmount,
} = fullSchemaPensions.definitions.careExpenses.items.properties;

const careOptions = {
  CARE_FACILITY: 'Care facility',
  IN_HOME_CARE_PROVIDER: 'In-home care provider',
};

const frequencyOptions = {
  ONCE_MONTH: 'Once a month',
  ONCE_YEAR: 'Once a year',
};

export const CareExpenseView = ({ formData }) => (
  <ListItemView title={formData.provider} />
);

CareExpenseView.propTypes = {
  formData: PropTypes.shape({
    provider: PropTypes.string,
  }),
};

/** @type {PageSchema} */
export default {
  title: 'List of unreimbursed care expenses',
  path: 'financial/care-expenses/add',
  depends: doesHaveCareExpenses,
  uiSchema: {
    ...titleUI(
      'List of unreimbursed care expenses',
      <ArrayDescription message="Add an unreimbursed care expense" />,
    ),
    careExpenses: {
      'ui:options': {
        itemName: 'Care Expense',
        itemAriaLabel: data => `${data.provider} care expense`,
        viewField: CareExpenseView,
        reviewTitle: 'Care Expenses',
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
        useVaCards: true,
        showSave: true,
        reviewMode: true,
      },
      items: {
        recipients: radioUI({
          title: 'Who receives care?',
          labels: recipientTypeLabels,
          classNames: 'vads-u-margin-bottom--2',
        }),
        childName: {
          'ui:title': 'Enter the child’s name',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            classNames: 'vads-u-margin-bottom--2',
            expandUnder: 'recipients',
            expandUnderCondition: 'DEPENDENT',
          },
          'ui:required': (form, index) =>
            get(['careExpenses', index, 'recipients'], form) === 'DEPENDENT',
        },
        provider: {
          'ui:title': 'What’s the name of the care provider?',
          'ui:webComponentField': VaTextInputField,
        },
        careType: radioUI({
          title: 'Choose the type of care:',
          labels: careOptions,
        }),
        ratePerHour: merge(
          {},
          currencyUI(
            'If this is an in-home provider, what is the rate per hour?',
          ),
          {
            'ui:options': {
              classNames: 'schemaform-currency-input-v3',
            },
          },
        ),
        hoursPerWeek: numberUI({
          title: 'How many hours per week does the care provider work?',
          width: 'sm',
          min: 1,
          max: 168,
        }),
        careDateRange: currentOrPastDateRangeUI(
          'Care start date',
          'Care end date',
          'End of care must be after start of care',
        ),
        noCareEndDate: {
          'ui:title': 'No end date',
          'ui:webComponentField': VaCheckboxField,
        },
        paymentFrequency: radioUI({
          title: 'How often are the payments?',
          labels: frequencyOptions,
        }),
        paymentAmount: merge({}, currencyUI('How much is each payment?'), {
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
      careExpenses: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: [
            'recipients',
            'provider',
            'careType',
            'paymentFrequency',
            'paymentAmount',
          ],
          properties: {
            recipients: radioSchema(Object.keys(recipientTypeLabels)),
            childName,
            provider,
            careType: radioSchema(Object.keys(careOptions)),
            ratePerHour,
            hoursPerWeek: numberSchema,
            careDateRange: {
              ...currentOrPastDateRangeSchema,
              required: ['from'],
            },
            noCareEndDate,
            paymentFrequency: radioSchema(Object.keys(frequencyOptions)),
            paymentAmount,
          },
        },
      },
    },
  },
};
