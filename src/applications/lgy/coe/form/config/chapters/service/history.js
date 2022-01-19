import ServicePeriodView from 'platform/forms/components/ServicePeriodView';
import {
  validateDate,
  validateDateRange,
} from 'platform/forms-system/src/js/validation';

import { serviceHistory } from '../../schemaImports';

export const schema = serviceHistory;

export const uiSchema = {
  servicePeriods: {
    'ui:title': 'Military service history',
    'ui:description':
      'Please add or update your military service history details below.',
    'ui:options': {
      itemName: 'Service Period',
      viewField: ServicePeriodView,
      keepInPageOnReview: true,
      showSave: true,
      reviewMode: true,
    },
    items: {
      'ui:title': 'Service period',
      'ui:options': {
        itemName: 'Military service history',
      },
      serviceBranch: {
        'ui:title': 'Branch of service',
      },
      dateRange: {
        'ui:validations': [validateDateRange],
        'ui:errorMessages': {
          pattern: 'End of service must be after start of service',
          required: 'Please enter a date',
        },
        from: {
          'ui:title': 'Service start date',
          'ui:widget': 'date',
          'ui:validations': [validateDate],
          'ui:errorMessages': {
            pattern: 'Please enter a valid date',
            required: 'Please enter a date',
          },
        },
        to: {
          'ui:title': 'Service end date',
          'ui:widget': 'date',
          'ui:validations': [validateDate],
          'ui:errorMessages': {
            pattern: 'Please enter a valid date',
            required: 'Please enter a date',
          },
          'ui:options': {
            hideEmptyValueInReview: true,
          },
        },
      },
    },
  },
};
