import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import { createSelector } from 'reselect';

import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import { isFullDate } from 'platform/forms/validations';
import {
  serviceNumberSchema,
  serviceNumberUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const { dateRange } = fullSchemaPensions.definitions;
import { serviceBranchLabels } from '../../../labels';
import { wartimeWarning, servedDuringWartime } from '../../../helpers';
import { validateServiceBirthDates } from '../../../validation';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Service period',
    serviceBranch: checkboxGroupUI({
      title: 'Branch of service',
      labels: serviceBranchLabels,
      required: true,
    }),
    activeServiceDateRange: dateRangeUI(
      'Date initially entered active duty',
      'Final release date from active duty',
      'Date initially entered active duty must be before final date released from active duty',
    ),
    serviceNumber: serviceNumberUI('Military Service number if you have one'),
    'ui:validations': [validateServiceBirthDates],
    'view:wartimeWarning': (() => {
      const hideWartimeWarning = createSelector(
        form => form.activeServiceDateRange,
        activeServiceDateRange => {
          const completePeriod =
            activeServiceDateRange &&
            isFullDate(activeServiceDateRange.to) &&
            isFullDate(activeServiceDateRange.from);

          if (!completePeriod) {
            return true;
          }

          return servedDuringWartime(activeServiceDateRange);
        },
      );

      return {
        'ui:description': wartimeWarning,
        'ui:options': {
          hideIf: hideWartimeWarning,
        },
      };
    })(),
  },
  schema: {
    type: 'object',
    required: ['serviceBranch', 'activeServiceDateRange'],
    properties: {
      serviceBranch: checkboxGroupSchema(Object.keys(serviceBranchLabels)),
      activeServiceDateRange: {
        ...dateRange,
        required: ['from', 'to'],
      },
      serviceNumber: serviceNumberSchema,
      'view:wartimeWarning': {
        type: 'object',
        properties: {},
      },
    },
  },
};
