import React from 'react';
import PropTypes from 'prop-types';
import {
  currencyUI,
  currencySchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ListItemView from '../../../components/ListItemView';
import {
  careFrequencyLabels,
  recipientTypeLabels,
} from '../../../utils/labels';

const MedicalExpenseView = ({ formData }) => (
  <ListItemView title={formData.provider} />
);

function MedicalExpenseDetailsDescription() {
  return (
    <div className="vads-u-margin-bottom--2">
      <p className="vads-u-margin-top--0">
        We want to know if you, your spouse, or your dependents pay medical or
        certain other expenses that aren’t reimbursed.
      </p>
      <va-additional-info trigger="How to report monthly recurring expenses">
        <p>
          For recurring monthly expenses, report them as a single expense.
          Include the start date and the monthly or annual cost.
        </p>
        <p>
          If a recurring expense has ended, treat the expense as non-recurring.
          Non-recurring expenses must be reported individually as separate
          expenses.
        </p>
        <p>Prescription medications are generally not considered recurring.</p>
      </va-additional-info>
    </div>
  );
}

MedicalExpenseView.propTypes = {
  formData: PropTypes.shape({
    provider: PropTypes.string,
  }),
};

/** @type {PageSchema} */
export default {
  title: 'List of medical expenses and other unreimbursed expenses',
  path: 'expenses/medical/add',
  depends: formData => formData.hasMedicalExpenses === true,
  uiSchema: {
    ...titleUI('List of medical expenses and other unreimbursed expenses'),
    'ui:description': MedicalExpenseDetailsDescription,
    medicalExpenses: {
      'ui:title': 'Add an unreimbursed medical expense',
      'ui:options': {
        itemName: 'Medical Expense',
        itemAriaLabel: data => `${data.provider} unreimbursed expense`,
        viewField: MedicalExpenseView,
        reviewTitle: 'Medical Expenses',
        keepInPageOnReview: true,
        confirmRemove: true,
        useDlWrap: true,
        useVaCards: true,
        showSave: true,
        reviewMode: true,
      },
      items: {
        recipient: radioUI({
          title: 'Who is the expense for?',
          labels: recipientTypeLabels,
        }),
        childName: textUI({
          title: 'Enter the child’s name',
          expandUnder: 'recipient',
          expandUnderCondition: field =>
            field === 'DEPENDENT' || field === 'OTHER',
          hideIf: (formData, index) =>
            !['DEPENDENT', 'OTHER'].includes(
              formData?.medicalExpenses?.[index]?.recipient,
            ),
          required: (formData, index) =>
            ['DEPENDENT', 'OTHER'].includes(
              formData?.medicalExpenses?.[index]?.recipient,
            ),
        }),
        provider: textUI('Who receives the payment?'),
        purpose: textUI('What is the payment for?'),
        paymentDate: currentOrPastDateUI({
          title: 'What’s the date of the payment?',
          monthSelect: false,
        }),
        paymentFrequency: radioUI({
          title: 'How often are the payments?',
          labels: careFrequencyLabels,
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
            'recipient',
            'provider',
            'purpose',
            'paymentDate',
            'paymentFrequency',
            'paymentAmount',
          ],
          properties: {
            recipient: radioSchema(Object.keys(recipientTypeLabels)),
            childName: textSchema,
            provider: textSchema,
            purpose: textSchema,
            paymentDate: currentOrPastDateSchema,
            paymentFrequency: radioSchema(Object.keys(careFrequencyLabels)),
            paymentAmount: currencySchema,
          },
        },
      },
    },
  },
};
