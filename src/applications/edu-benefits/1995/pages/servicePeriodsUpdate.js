import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';
import merge from 'lodash/merge';

export const uiSchema = {
  'view:newService': {
    'ui:title':
      'Do you have any new periods of service to record since you last applied for education benefits?',
    'ui:widget': 'yesNo',
  },
  toursOfDuty: merge(
    {},
    {
      'ui:options': {
        expandUnder: 'view:newService',
      },
      to: {
        'ui:required': formData => formData['view:newService'],
      },
      from: {
        'ui:required': formData => formData['view:newService'],
      },
    },
    dateRangeUI('Start date', 'End date'),
  ),
};

export const schema = {
  type: 'object',
  properties: {
    'view:newService': {
      type: 'boolean',
    },
    toursOfDuty: fullSchema1995.definitions.dateRange,
  },
};

// toursOfDuty: fullSchema1995.definitions.dateRange,
/*
toursOfDuty: toursOfDuty.schema(fullSchema1995, {
                required: ['serviceBranch', 'dateRange.from'],
                fields: [
                  'serviceBranch',
                  'serviceStatus',
                  'dateRange',
                  'applyPeriodToSelected',
                  'benefitsToApplyTo',
                  'view:disclaimer',
                ],
              }),
 */
