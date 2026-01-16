import {
  titleUI,
  currentOrPastDateSchema,
  currentOrPastDateRangeUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaComboBoxField from 'platform/forms-system/src/js/web-component-fields/VaComboBoxField';

import { servicesOptions } from '../../../utils/labels';

/** @type {PageSchema} */
export default {
  title: 'Service period',
  path: 'veteran/service-period',
  uiSchema: {
    ...titleUI('Service period'),
    serviceBranch: {
      'ui:webComponentField': VaComboBoxField,
      'ui:title': 'Branch of service',
      'ui:errorMessages': {
        required: 'Select a branch',
      },
      'ui:options': {
        labels: servicesOptions,
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
        enum: Object.entries(servicesOptions).map(key => key[0]),
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
