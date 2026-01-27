import {
  titleUI,
  currentOrPastDateSchema,
  currentOrPastDateRangeUI,
  textUI,
  textSchema,
  selectUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { servicesOptions } from '../../../utils/labels';

/** @type {PageSchema} */
export default {
  title: 'Service period',
  path: 'veteran/service-period',
  uiSchema: {
    ...titleUI('Service period'),
    serviceBranch: {
      ...selectUI({
        title: 'Branch of service',
        options: servicesOptions,
      }),
      'ui:errorMessages': {
        required: 'Select a branch',
      },
    },
    activeServiceDateRange: currentOrPastDateRangeUI(
      {
        title: 'Date initially entered active duty',
        monthSelect: false,
      },
      {
        title: 'Final release date from active duty',
        monthSelect: false,
      },
    ),
    placeOfSeparation: textUI({
      title: 'Place of Veteran’s last separation',
      hint: 'City, state, or foreign country',
    }),
  },
  schema: {
    type: 'object',
    required: ['serviceBranch', 'activeServiceDateRange', 'placeOfSeparation'],
    properties: {
      serviceBranch: {
        type: 'string',
        enum: servicesOptions.map(option => option.value),
        enumNames: servicesOptions.map(option => option.label),
      },
      activeServiceDateRange: {
        type: 'object',
        required: ['from', 'to'],
        properties: {
          from: currentOrPastDateSchema,
          to: currentOrPastDateSchema,
        },
      },
      placeOfSeparation: textSchema,
    },
  },
};
