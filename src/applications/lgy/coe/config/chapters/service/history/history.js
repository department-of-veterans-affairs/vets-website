import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import ServicePeriodView from 'platform/forms/components/ServicePeriodView';

import { serviceHistory } from '../../../schemaImports';

export const schema = serviceHistory;

export const uiSchema = {
  servicePeriods: {
    'ui:title': 'Military service history',
    'ui:description':
      'Please add or update your military service history details below.',
    'ui:options': {
      itemName: 'Service Period',
      viewField: ServicePeriodView,
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
      dateRange: dateRangeUI(
        'Service start date',
        'Service end date',
        'End of service must be after start of service',
      ),
    },
  },
};
