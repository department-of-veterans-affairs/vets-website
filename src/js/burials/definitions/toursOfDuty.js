import dateRangeUI from '../../common/schemaform/definitions/dateRange';
import ServicePeriodView from '../../common/schemaform/ServicePeriodView';

export default {
  'ui:title': 'Service periods',
  'ui:options': {
    itemName: 'Service Period',
    viewField: ServicePeriodView,
    hideTitle: true,
  },
  items: {
    dateRange: dateRangeUI(
      'Start of service period',
      'End of service period',
      'End of service must be after start of service'
    ),
    serviceBranch: {
      'ui:title': 'Branch of service'
    },
    rank: {
      'ui:title': 'Rank'
    },
    serviceNumber: {
      'ui:title': 'Service number'
    },
    placeOfEntry: {
      'ui:title': 'Place of entry'
    },
    placeOfSeparation: {
      'ui:title': 'Place of separation'
    }
  }
};
