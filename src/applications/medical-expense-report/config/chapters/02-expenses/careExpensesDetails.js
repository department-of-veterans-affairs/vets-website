import React from 'react';
import PropTypes from 'prop-types';
import get from 'platform/utilities/data/get';
import {
  currencyUI,
  currencySchema,
  radioUI,
  checkboxUI,
  radioSchema,
  titleUI,
  numberSchema,
  checkboxSchema,
  numberUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import ListItemView from '../../../components/ListItemView';
import { recipientTypeLabels } from '../../../utils/labels';

const {
  childName,
  provider,
} = fullSchemaPensions.definitions.medicalExpenses.items.properties;

const CareExpenseView = ({ formData }) => (
  <ListItemView title={formData.provider} />
);

CareExpenseView.propTypes = {
  formData: PropTypes.shape({
    provider: PropTypes.string,
  }),
};

/** @type {PageSchema} */
export default {
  title: 'In-home and facility care',
  path: 'expenses/care/add',
  depends: formData => formData.hasCareExpenses === true,
  uiSchema: {
    ...titleUI('Add unreimbursed care expenses'),
    careExpenses: {
      'ui:options': {
        itemName: 'In-home or Facility Care Expense',
        itemAriaLabel: data =>
          `${data.provider} in-home or cacility care expense`,
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
          title: 'Who is the expense for?',
          labels: recipientTypeLabels,
        }),
        // TODO: Change to recipient when schema is updated.
        childName: {
          'ui:title': 'Full name of the person who received care',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
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
        hoursPerWeek: numberUI(
          'How many hours per week does the care provider work?',
        ),
        paymentDate: currentOrPastDateRangeUI(
          {
            title: 'Care start date',
            monthSelect: false,
          },
          {
            title: 'Care end date',
            monthSelect: false,
          },
        ),
        noEndDate: checkboxUI('No end date'),
        paymentPeriod: radioUI({
          title: 'How often are the payments?',
          labels: {
            monthly: 'Once a month',
            yearly: 'Once a year',
          },
        }),
        paymentAmount: currencyUI('How much is each payment?'),
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
            'childName',
            'provider',
            'paymentDate',
            'paymentPeriod',
            'paymentAmount',
          ],
          properties: {
            recipients: radioSchema(Object.keys(recipientTypeLabels)),
            childName,
            provider,
            hoursPerWeek: numberSchema,
            paymentDate: {
              ...currentOrPastDateRangeSchema,
              required: ['from'],
            },
            noEndDate: checkboxSchema,
            paymentPeriod: radioSchema(['monthly', 'yearly']),
            paymentAmount: currencySchema,
          },
        },
      },
    },
  },
};
