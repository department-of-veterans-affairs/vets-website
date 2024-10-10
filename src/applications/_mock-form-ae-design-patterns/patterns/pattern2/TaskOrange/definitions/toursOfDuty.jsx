import React from 'react';
import pick from 'lodash/pick';

import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import ServicePeriodView from 'platform/forms/components/ServicePeriodView';

/**
 * Returns schema for toursOfDuty based on the property names passed to it.
 * This is because some forms don’t need all the information others do.
 *
 * Note: The order in which the names are in the array will affect the order
 *  they will appear in the form.
 */
export function schema(currentSchema, userOptions) {
  const options = {
    fields: ['serviceBranch', 'dateRange'],
    required: [],
    ...userOptions,
  };

  const requiredFields = options.required.filter(
    field => field.indexOf('.') < 0,
  );
  const dateRangeRequiredFields = options.required
    .filter(field => field.startsWith('dateRange.'))
    .map(field => field.replace('dateRange.', ''));

  const possibleProperties = {
    serviceBranch: {
      type: 'string',
    },
    dateRange: {
      ...currentSchema.definitions.dateRange,
      required: dateRangeRequiredFields,
    },
    serviceStatus: {
      type: 'string',
    },
    applyPeriodToSelected: {
      type: 'boolean',
      default: true,
    },
    benefitsToApplyTo: {
      type: 'string',
    },
    'view:disclaimer': {
      type: 'object',
      properties: {},
    },
  };

  return {
    type: 'array',
    minItems: options.required.length > 0 ? 1 : 0,
    items: {
      type: 'object',
      required: requiredFields,
      properties: pick(possibleProperties, options.fields),
    },
  };
}

export const uiSchema = {
  'ui:title': 'Service periods',
  'ui:options': {
    itemName: 'Service period',
    viewField: ServicePeriodView,
    hideTitle: true,
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
    serviceStatus: {
      'ui:title':
        'Type of service (Active duty, drilling reservist, National Guard, IRR)',
    },
    applyPeriodToSelected: {
      'ui:title': 'Apply this service period to the benefit I’m applying for.',
      'ui:options': {
        hideOnReviewIfFalse: true,
      },
    },
    benefitsToApplyTo: {
      'ui:title': 'Please explain how you’d like this service period applied.',
      'ui:widget': 'textarea',
      'ui:options': {
        expandUnder: 'applyPeriodToSelected',
        expandUnderCondition: false,
      },
    },
    'view:disclaimer': {
      'ui:description': (
        <div>
          <p className="vads-u-background-color--white vads-u-color--gray-dark">
            A single period of service may not be applied toward more than one
            benefit.
          </p>
          <p className="vads-u-background-color--white vads-u-color--gray-dark">
            There is one exception: If your period of service began before
            August 1, 2011, you may use it to establish eligibility to Chapter
            33 even if it has already been used to establish eligibility to a
            different benefit.
          </p>
        </div>
      ),
      'ui:options': {
        expandUnder: 'applyPeriodToSelected',
        expandUnderCondition: false,
      },
    },
  },
};
