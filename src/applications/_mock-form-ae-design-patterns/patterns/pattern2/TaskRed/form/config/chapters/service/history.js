import ServicePeriodView from 'platform/forms/components/ServicePeriodView';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';

import { serviceHistory } from '../../schemaImports';

export const schema = serviceHistory;

export const uiSchema = {
  periodsOfService: {
    'ui:title': 'Military service history',
    'ui:description':
      'Add or update your military service history details below.',
    'ui:options': {
      itemName: 'Service Period',
      viewField: ServicePeriodView,
      keepInPageOnReview: true,
      customTitle: ' ', // Prevent outer DL wrapper
      useDlWrap: true, // Move DL wrap to immediately around list
    },
    items: {
      'ui:title': 'Service period',
      'ui:options': {
        classNames: 'column',
        itemName: 'Military service history',
      },
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
};
