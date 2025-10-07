import React from 'react';
import PropTypes from 'prop-types';
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
  textUI,
  textSchema,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ListItemView from '../../../components/ListItemView';
import { recipientTypeLabels } from '../../../utils/labels';

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
        childName: textUI({
          title: 'Enter the child’s name',
          expandUnder: 'recipients',
          expandUnderCondition: field =>
            field === 'DEPENDENT' || field === 'OTHER',
          hideIf: (formData, index) =>
            !['DEPENDENT', 'OTHER'].includes(
              formData?.careExpenses?.[index]?.recipients,
            ),
          required: (formData, index) =>
            ['DEPENDENT', 'OTHER'].includes(
              formData?.careExpenses?.[index]?.recipients,
            ),
        }),
        provider: textUI('What’s the name of the care provider?'),
        careDate: currentOrPastDateRangeUI(
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
        monthlyPayment: currencyUI('How much is each monthly payment?'),
        typeOfCare: radioUI({
          title: 'Select the type of care.',
          labels: {
            residential: 'Residential care facility',
            inHome: 'In-home care attendant',
          },
        }),
        hourlyRate: currencyUI('What is the provider’s rate per hour?'),
        hoursPerWeek: numberUI(
          'How many hours per week does the care provider work?',
        ),
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
            'careDate',
            'monthlyPayment',
            'typeOfCare',
            'hourlyRate',
            'hoursPerWeek',
          ],
          properties: {
            recipients: radioSchema(Object.keys(recipientTypeLabels)),
            childName: textSchema,
            provider: textSchema,
            careDate: {
              ...currentOrPastDateRangeSchema,
              required: ['from'],
            },
            noEndDate: checkboxSchema,
            monthlyPayment: currencySchema,
            typeOfCare: radioSchema(['residential', 'inHome']),
            hourlyRate: currencySchema,
            hoursPerWeek: numberSchema,
          },
        },
      },
    },
  },
};
