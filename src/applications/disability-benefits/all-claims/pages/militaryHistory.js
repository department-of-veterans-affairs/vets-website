import dateRangeUI from 'us-forms-system/lib/js/definitions/dateRange';
import ServicePeriodView from '../../../../platform/forms/components/ServicePeriodView';

import fullSchema from '../config/schema';

export const uiSchema = {
  serviceInformation: {
    servicePeriods: {
      'ui:title': 'Military service history',
      'ui:description':
        'This is the military service history we have on file for you.',
      'ui:options': {
        itemName: 'Service Period',
        viewField: ServicePeriodView,
        reviewMode: true,
      },
      items: {
        serviceBranch: {
          'ui:title': 'Branch of service',
        },
        dateRange: dateRangeUI(
          'Service start date',
          'Service end date',
          'End of service must be after start of service',
        ),
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    serviceInformation: {
      type: 'object',
      properties: {
        servicePeriods:
          fullSchema.properties.serviceInformation.properties.servicePeriods,
        'view:militaryHistoryNote': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
