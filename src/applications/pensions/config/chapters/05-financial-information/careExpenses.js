import React from 'react';
import PropTypes from 'prop-types';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import {
  radioUI,
  radioSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import currencyUI from '@department-of-veterans-affairs/platform-forms-system/currency';
import dateRangeUI from '@department-of-veterans-affairs/platform-forms-system/dateRange';
import ListItemView from '../../../components/ListItemView';

const { dateRange } = fullSchemaPensions.definitions;

const recipientOptions = {
  VETERAN: 'Veteran',
  SPOUSE: 'Veteran’s spouse',
  CHILD: 'Veteran’s child',
};

const careOptions = {
  CARE_FACILITY: 'Care facility',
  IN_HOME_CARE_PROVIDER: 'In-home care provider',
};

const frequencyOptions = {
  ONCE_MONTH: 'Once a month',
  ONCE_YEAR: 'Once a year',
  ONE_TIME: 'One-time',
};

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
  uiSchema: {
    'ui:title': 'Add an unreimbursed care expense',
    careExpenses: {
      'ui:options': {
        itemName: 'Care Expense',
        viewField: CareExpenseView,
        reviewTitle: 'Care Expenses',
      },
      items: {
        recipients: radioUI({
          title: 'Who receives care?',
          labels: recipientOptions,
          classNames: 'vads-u-margin-bottom--2',
        }),
        childName: {
          'ui:title': 'Enter the child’s name',
          'ui:options': {
            expandUnder: 'recipients',
            expandUnderCondition: 'Veteran’s child',
          },
          'ui:required': form =>
            get(['recipients'], form) === 'Veteran’s child',
        },
        provider: {
          'ui:title': 'What’s the name of the care provider?',
        },
        careType: radioUI({
          title: 'Choose the type of care:',
          labels: careOptions,
        }),
        ratePerHour: currencyUI(
          'If this is an in-home provider, what is the rate per hour?',
        ),
        hoursPerWeek: {
          'ui:title': 'How many hours per week does the care provider work?',
          'ui:validations': [
            (errors, fieldData) => {
              if (fieldData > 168) {
                errors.addError('Enter a number less than 169');
              }
            },
          ],
        },
        careDateRange: dateRangeUI(
          'Care start date',
          'Care end date',
          'End of care must be after start of care',
        ),
        noCareEndDate: {
          'ui:title': 'No end date',
        },
        paymentFrequency: radioUI({
          title: 'How often are the payments?',
          labels: frequencyOptions,
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
            'careType',
            'paymentFrequency',
            'paymentAmount',
          ],
          properties: {
            recipients: radioSchema(Object.values(recipientOptions)),
            childName: { type: 'string' },
            provider: { type: 'string' },
            careType: radioSchema(Object.values(careOptions)),
            ratePerHour: { type: 'number' },
            hoursPerWeek: { type: 'number' },
            careDateRange: {
              ...dateRange,
              required: ['from'],
            },
            noCareEndDate: { type: 'boolean' },
            paymentFrequency: radioSchema(Object.values(frequencyOptions)),
            paymentAmount: { type: 'number' },
          },
        },
      },
    },
  },
};
