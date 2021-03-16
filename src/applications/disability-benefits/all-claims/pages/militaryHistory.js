import moment from 'moment';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import ValidatedServicePeriodView from '../components/ValidatedServicePeriodView';
import ArrayField from '../components/ArrayField';
import { isValidServicePeriod, formatDate } from '../utils';

const dateRangeUISchema = dateRangeUI(
  'Service start date',
  'Service end date',
  'End of service must be after start of service',
);

const validateAge = (
  errors,
  dateString,
  formData,
  schema,
  uiSchema,
  currentIndex,
  appStateData,
) => {
  if (moment(dateString).isBefore(moment(appStateData.dob).add(13, 'years'))) {
    errors.addError('Your start date must be after your 13th birthday');
  }
};

const validateSeparationDate = (
  errors,
  dateString,
  formData,
  schema,
  uiSchema,
  currentIndex,
  appStateData,
) => {
  const allowBDD = appStateData.allowBDD;
  if (!allowBDD && moment(dateString).isAfter(moment())) {
    errors.addError('Your separation date must be in the past');
  } else if (
    allowBDD &&
    moment(dateString).isAfter(moment().add(180, 'days'))
  ) {
    errors.addError('Your separation date must be before 180 days from today');
  }
};

dateRangeUISchema.from['ui:validations'].push(validateAge);
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
        },
        dateRange: dateRangeUISchema,
        'ui:options': {
          itemAriaLabel,
          itemName: 'Military service history',
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    serviceInformation: {
      required: ['servicePeriods'], // required in fullSchema
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
