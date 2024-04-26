import React from 'react';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Date web components'),
    dateWCV3: currentOrPastDateUI('Web component - Generic'),
    dateOfBirthWCV3: dateOfBirthUI('Web component - Date of birth'),
    'view:dateSubTitle': {
      'ui:description': <h4>Date range pattern</h4>,
    },
    dateRange: currentOrPastDateRangeUI(
      'Start date',
      'End date',
      'End date must be after start date',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      dateWCV3: currentOrPastDateSchema,
      dateOfBirthWCV3: dateOfBirthSchema,
      'view:dateSubTitle': {
        type: 'object',
        properties: {},
      },
      dateRange: currentOrPastDateRangeSchema,
    },
    required: ['dateWCV3'],
  },
};
