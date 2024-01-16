import React from 'react';
import PropTypes from 'prop-types';
import get from 'platform/utilities/data/get';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import ListItemView from '../../../components/ListItemView';

const recipientOptions = {
  VETERAN: 'Veteran',
  SPOUSE: 'Veteran’s spouse',
  CHILD: 'Veteran’s child',
};

const frequencyOptions = {
  ONCE_MONTH: 'Once a month',
  ONCE_YEAR: 'Once a year',
  ONE_TIME: 'One-time',
};

const MedicalExpenseView = ({ formData }) => (
  <ListItemView title={formData.provider} />
);

MedicalExpenseView.propTypes = {
  formData: PropTypes.shape({
    provider: PropTypes.string,
  }),
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Add a medical or other unreimbursed expense',
    medicalExpenses: {
      'ui:options': {
        itemName: 'Unreimbursed Expense',
        viewField: MedicalExpenseView,
        reviewTitle: 'Unreimbursed Expenses',
        keepInPageOnReview: true,
      },
      items: {
        recipients: radioUI({
          title: 'Who is the expense for?',
          labels: recipientOptions,
          classNames: 'vads-u-margin-bottom--2',
        }),
        childName: {
          'ui:title': 'Enter the child’s name',
          'ui:options': {
            classNames: 'vads-u-margin-bottom--2',
            expandUnder: 'recipients',
            expandUnderCondition: 'CHILD',
          },
          'ui:required': (form, index) =>
            get(['medicalExpenses', index, 'recipients'], form) === 'CHILD',
        },
        provider: {
          'ui:title': 'Who receives the payment?',
        },
        purpose: {
          'ui:title': 'What’s the payment for?',
        },
        paymentDate: currentOrPastDateUI('What’s the date of the payment?'),
        paymentFrequency: radioUI({
          title: 'How often are the payments?',
          labels: frequencyOptions,
          classNames: 'vads-u-margin-bottom--2',
        }),
        paymentAmount: currencyUI('How much is each payment?'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      medicalExpenses: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: [
            'recipients',
            'childName',
            'provider',
            'purpose',
            'paymentDate',
            'paymentFrequency',
            'paymentAmount',
          ],
          properties: {
            recipients: radioSchema(Object.keys(recipientOptions)),
            childName: { type: 'string' },
            provider: { type: 'string' },
            purpose: { type: 'string' },
            paymentDate: currentOrPastDateSchema,
            paymentFrequency: radioSchema(Object.keys(frequencyOptions)),
            paymentAmount: { type: 'number' },
          },
        },
      },
    },
  },
};
