import * as dateRange from '../../common/schemaform/definitions/dateRange';
import ServicePeriodView from '../components/ServicePeriodView';

// Should we put the schema in here too if it's just going to be the same
//  as in the schema from vets-json-schema?

export const uiSchema = {
  'ui:title': 'Service periods',
  'ui:options': {
    itemName: 'Service Period',
    viewField: ServicePeriodView,
    hideTitle: true,
  },
  items: {
    serviceBranch: {
      'ui:title': 'Branch of service'
    },
    dateRange: dateRange.uiSchema(
      'Start of service period',
      'End of service period',
      'End of service must be after start of service'
    )
  }
};
