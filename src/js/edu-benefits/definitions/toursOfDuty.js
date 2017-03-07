import * as dateRange from '../../common/schemaform/definitions/dateRange';
import ServicePeriodView from '../components/ServicePeriodView';

/**
 * Returns schema for toursOfDuty based on the property names passed to it.
 * This is because some forms don't need all the information others do.
 *
 * Note: The order in which the names are in the array will affect the order
 *  they will appear in the form.
 */
export function schema(propNames = ['serviceBranch', 'dateRange']) {
  const todSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {}
    }
  };

  const possibleProperties = {
    serviceBranch: {
      type: 'string'
    },
    dateRange: dateRange.schema,
    serviceStatus: {
      type: 'string'
    },
    applyPeriodToSelected: {
      type: 'boolean'
    },
    benefitsToApplyTo: {
      type: 'string'
    }
  };

  // For each propName, fill in additional properties if possible
  propNames.forEach((propName) => {
    todSchema.items.properties[propName] = possibleProperties[propName];
  });

  return todSchema;
}

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
    ),
    applyPeriodToSelected: {
      'ui:title': 'Apply this service period to the benefit I’m applying for.'
    }
  }
};
