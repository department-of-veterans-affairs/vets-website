import React from 'react';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  currentOrPastMonthYearDateUI,
  currentOrPastMonthYearDateRangeUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateRangeSchema,
  currentOrPastDateDigitsUI,
  currentOrPastDateDigitsSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Date web components'),
    dateWCV3: currentOrPastDateUI('Web component - Generic'),
    dateDigitsWCV3: currentOrPastDateDigitsUI('Web component - Date with digit month input'),
    dateOfBirthWCV3: dateOfBirthUI('Web component - Date of birth'),
    'view:dateSubTitle': {
      'ui:description': <h4>Date range pattern</h4>,
    },
    dateRange: currentOrPastDateRangeUI(
      'Start date',
      'End date',
      'End date must be after start date',
    ),
    'view:monthYearDates': {
      'ui:description': <h4>Month year only</h4>,
    },
    dateMonthYear: currentOrPastMonthYearDateUI('Month and year only'),
    dateMonthYearRange: currentOrPastMonthYearDateRangeUI(
      {
        title: 'Start date',
        hint: 'Start date must be before end date',
      },
      {
        title: 'End date',
        hint: 'End date must be after start date',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      dateWCV3: currentOrPastDateSchema,
      dateDigitsWCV3: currentOrPastDateDigitsSchema,
      dateOfBirthWCV3: dateOfBirthSchema,
      'view:dateSubTitle': {
        type: 'object',
        properties: {},
      },
      dateRange: currentOrPastDateRangeSchema,
      'view:monthYearDates': {
        type: 'object',
        properties: {},
      },
      dateMonthYear: currentOrPastMonthYearDateSchema,
      dateMonthYearRange: currentOrPastMonthYearDateRangeSchema,
    },
    required: ['dateWCV3', 'dateDigitsWCV3', 'dateMonthYear'],
  },
};
