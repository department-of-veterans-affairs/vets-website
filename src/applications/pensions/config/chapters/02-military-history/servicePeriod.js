import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import { createSelector } from 'reselect';

import dateRangeUI from '@department-of-veterans-affairs/platform-forms-system/dateRange';
import { isFullDate } from '@department-of-veterans-affairs/platform-forms/validations';
import {
  serviceNumberSchema,
  serviceNumberUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

const { dateRange } = fullSchemaPensions.definitions;
import { wartimeWarning, servedDuringWartime } from '../../../helpers';
import { validateServiceBirthDates } from '../../../validation';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Service period',
    serviceBranch: {
      'ui:title': 'Branch of service',
    },
    activeServiceDateRange: dateRangeUI(
      'Service start date',
      'Service end date',
      'Date entered service must be before date left service',
    ),
    serviceNumber: serviceNumberUI(),
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
    required: ['serviceBranch', 'activeServiceDateRange', 'serviceNumber'],
    properties: {
      serviceBranch: {
        type: 'string',
      },
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
