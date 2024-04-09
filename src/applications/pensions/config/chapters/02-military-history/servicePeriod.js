import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import { createSelector } from 'reselect';

import { isFullDate } from 'platform/forms/validations';
import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  serviceNumberUI,
  serviceNumberSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';

const { placeOfSeparation } = fullSchemaPensions.properties;

import { serviceBranchLabels } from '../../../labels';
import { WartimeWarningAlert } from '../../../components/FormAlerts';
import { servedDuringWartime } from '../../../helpers';
import { validateServiceBirthDates } from '../../../validation';
import ServicePeriodReview from '../../../components/ServicePeriodReview';

/** @type {PageSchema} */
export default {
  path: 'military/history',
  title: 'Service period',
  CustomPageReview: ServicePeriodReview,
  uiSchema: {
    ...titleUI('Service period'),
    serviceBranch: checkboxGroupUI({
      title: 'Branch of service',
      labels: serviceBranchLabels,
      required: true,
    }),
    activeServiceDateRange: currentOrPastDateRangeUI(
      'Date initially entered active duty',
      'Final release date from active duty',
      'Date initially entered active duty must be before final date released from active duty',
    ),
    serviceNumber: serviceNumberUI('Military Service number if you have one'),
    placeOfSeparation: {
      'ui:title': 'Place of your last separation',
      'ui:options': {
        hint: 'City and state or foreign country',
      },
      'ui:webComponentField': VaTextInputField,
    },
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
        'ui:description': WartimeWarningAlert,
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
      activeServiceDateRange: currentOrPastDateRangeSchema,
      serviceNumber: serviceNumberSchema,
      placeOfSeparation,
      'view:wartimeWarning': {
        type: 'object',
        properties: {},
      },
    },
  },
};
