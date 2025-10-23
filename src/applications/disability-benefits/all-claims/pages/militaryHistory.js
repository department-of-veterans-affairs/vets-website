import set from 'platform/utilities/data/set';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { validateCurrentOrPastDate } from 'platform/forms-system/src/js/validation';

import ValidatedServicePeriodView from '../components/ValidatedServicePeriodView';
import ArrayField from '../components/ArrayField';
import { isValidServicePeriod, formatDate } from '../utils';
import { validateAge, validateSeparationDate } from '../validations';
import { getBranches } from '../utils/serviceBranches';

import { serviceNoticeContent } from '../content/militaryHistoryContent';

const dateRangeUISchema = dateRangeUI(
  'Active service start date',
  'Active service end date',
  'End of service must be after start of service',
);

dateRangeUISchema.from['ui:validations'].push(
  validateAge,
  validateCurrentOrPastDate,
);
dateRangeUISchema.to['ui:validations'].push(validateSeparationDate);

const itemAriaLabel = data => {
  const hasDate =
    data.serviceBranch && data.dateRange?.from
      ? ` started on ${formatDate(data.dateRange.from)}`
      : '';
  return `${data.serviceBranch || ''}${hasDate}`;
};

export const uiSchema = {
  serviceInformation: {
    servicePeriods: {
      'ui:title': 'Military service history',
      'ui:description':
        'Please add or update your military service history details below.',
      'ui:field': ArrayField,
      'ui:options': {
        itemName: 'Service Period',
        itemAriaLabel,
        viewField: ValidatedServicePeriodView,
        reviewMode: true,
        showSave: true,
        setEditState: formData =>
          formData.map(data => !isValidServicePeriod(data)),
      },
      items: {
        serviceBranch: {
          'ui:title': 'Branch of service',
          'ui:options': {
            updateSchema: (_formData, schema) => {
              if (!schema.enum?.length) {
                const options = getBranches();
                return set('enum', options, schema);
              }
              return schema;
            },
          },
        },
        dateRange: dateRangeUISchema,
        'ui:options': {
          itemAriaLabel,
          itemName: 'Military service history',
        },
      },
    },
  },
  'view:serviceNote': {
    'ui:description': serviceNoticeContent,
  },
};

export const schema = {
  type: 'object',
  properties: {
    serviceInformation: {
      type: 'object',
      required: ['servicePeriods'],
      properties: {
        servicePeriods:
          fullSchema.properties.serviceInformation.properties.servicePeriods,
      },
    },
    'view:serviceNote': {
      type: 'object',
      properties: {},
    },
  },
};
