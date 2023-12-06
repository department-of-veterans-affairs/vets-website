import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import { createSelector } from 'reselect';

import dateRangeUI from '@department-of-veterans-affairs/platform-forms-system/dateRange';
import { isFullDate } from '@department-of-veterans-affairs/platform-forms/validations';
import {
  serviceNumberSchema,
  serviceNumberUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import ServicePeriodView from '../components/ServicePeriodView';

const { dateRange } = fullSchemaPensions.definitions;
import { wartimeWarning, servedDuringWartime } from '../helpers';
import { validateServiceBirthDates } from '../validation';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Service periods',
    servicePeriods: {
      'ui:options': {
        itemName: 'Service Period',
        viewField: ServicePeriodView,
        reviewTitle: 'Service periods',
      },
      items: {
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
      },
    },
    'view:wartimeWarning': (() => {
      const hideWartimeWarning = createSelector(
        form => form.servicePeriods,
        periods => {
          const completePeriods = (periods || []).filter(
            period =>
              period.activeServiceDateRange &&
              isFullDate(period.activeServiceDateRange.to) &&
              isFullDate(period.activeServiceDateRange.from),
          );
          if (!completePeriods.length) {
            return true;
          }
          return completePeriods.some(period =>
            servedDuringWartime(period.activeServiceDateRange),
          );
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
    properties: {
      servicePeriods: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: [
            'serviceBranch',
            'activeServiceDateRange',
            'serviceNumber',
          ],
          properties: {
            serviceBranch: {
              type: 'string',
            },
            activeServiceDateRange: {
              ...dateRange,
              required: ['from', 'to'],
            },
            serviceNumber: serviceNumberSchema,
          },
        },
      },
      'view:wartimeWarning': {
        type: 'object',
        properties: {},
      },
    },
  },
};
