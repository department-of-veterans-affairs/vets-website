import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import { createSelector } from 'reselect';

import dateRangeUI from '@department-of-veterans-affairs/platform-forms-system/dateRange';
import { isFullDate } from '@department-of-veterans-affairs/platform-forms/validations';
import {
  serviceNumberSchema,
  serviceNumberUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

const { dateRange } = fullSchemaPensions.definitions;
import { wartimeWarning, servedDuringWartime } from '../../../helpers';
import { validateServiceBirthDates } from '../../../validation';

const serviceBranchOptions = {
  ARMY: 'Army',
  NAVY: 'Navy',
  AIR_FORCE: 'Air Force',
  COAST_GUARD: 'Coast Guard',
  MARINE_CORPS: 'Marine Corps',
  SPACE_FORCE: 'Space Force',
  USPHS: 'USPHS',
  NOAA: 'NOAA',
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Service period',
    serviceBranch: checkboxGroupUI({
      title: 'Branch of service',
      labels: serviceBranchOptions,
      required: true,
    }),
    activeServiceDateRange: dateRangeUI(
      'Date initially entered active duty',
      'Final release date from active duty',
      'Date initially entered active duty must be before final date released from active duty',
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
      serviceBranch: checkboxGroupSchema(Object.keys(serviceBranchOptions)),
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
