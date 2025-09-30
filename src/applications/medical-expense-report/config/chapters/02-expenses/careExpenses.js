import React from 'react';
import PropTypes from 'prop-types';
import get from 'platform/utilities/data/get';
import {
  currencyUI,
  currencySchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import ListItemView from '../../../components/ListItemView';
import { recipientTypeLabels } from '../../../utils/labels';
import { doesHaveCareExpenses } from './helpers';
import ArrayDescription from '../../../components/ArrayDescription';
import { showMultiplePageResponse } from '../../../utils/helpers';
// import CareExpenseDescription from '../../../components/CareExpenseDescription';

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
  path: 'expenses/care-expenses/add',
  depends: formData =>
    !showMultiplePageResponse() && doesHaveCareExpenses(formData),
  uiSchema: {
    ...titleUI(
      'In-home and facility care expense reporting',
      <ArrayDescription message="Add an expense for in-home or facility care" />,
    ),
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
          'ui:title': 'Who receives the payment?',
          'ui:webComponentField': VaTextInputField,
        },
        paymentDate: currentOrPastDateUI('What’s the date of the payment?'),
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
            'paymentAmount',
          ],
          properties: {
            recipients: radioSchema(Object.keys(recipientTypeLabels)),
            childName,
            provider,
            paymentDate: currentOrPastDateSchema,
            paymentAmount: currencySchema,
          },
        },
      },
    },
  },
};
