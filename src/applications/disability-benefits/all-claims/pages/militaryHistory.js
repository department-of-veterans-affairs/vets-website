import moment from 'moment';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import ValidatedServicePeriodView from '../components/ValidatedServicePeriodView';

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

dateRangeUISchema.from['ui:validations'].push(validateAge);

export const uiSchema = {
  serviceInformation: {
    servicePeriods: {
      'ui:title': 'Military service history',
      'ui:description':
        'This is the military service history we have on file for you.',
      'ui:options': {
        itemName: 'Service Period',
        viewField: ValidatedServicePeriodView,
        reviewMode: true,
      },
      items: {
        serviceBranch: {
          'ui:title': 'Branch of service',
        },
        dateRange: dateRangeUISchema,
        'ui:options': {
          ariaLabelForEditButtonOnReview: 'Edit Military service history',
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
