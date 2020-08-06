import moment from 'moment';
import dateRangeUI from 'platform/forms-system/src/js/definitions/dateRange';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import AutosuggestField from 'platform/forms-system/src/js/fields/AutosuggestField';
import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';

import ValidatedServicePeriodView from '../components/ValidatedServicePeriodView';
import { isBDD } from '../utils';
import {
  SeparationLocationTitle,
  SeparationLocationDescription,
} from '../content/militaryHistory';
import { checkSeparationLocation } from '../validations';
import separationLocations from '../content/separationLocations';

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

export const uiSchema = {
  serviceInformation: {
    servicePeriods: {
      'ui:title': 'Military service history',
      'ui:description':
        'Please add or update your military service history details below.',
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
    'view:separationLocation': {
      'ui:title': SeparationLocationTitle,
      'ui:description': SeparationLocationDescription,
      'ui:options': {
        hideIf: formData => !isBDD(formData),
      },
    },
    // Not using autosuggest.uiSchema; validations not set?
    separationLocation: {
      'ui:title': 'Enter a location',
      'ui:field': AutosuggestField,
      'ui:required': formData => isBDD(formData),
      'ui:validations': [checkSeparationLocation],
      'ui:options': {
        hideIf: formData => !isBDD(formData),
        showFieldLabel: 'label',
        maxOptions: 20,
        getOptions: () =>
          Promise.resolve().then(() =>
            separationLocations.map(({ code, description }) => ({
              id: code,
              label: description,
            })),
          ),
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
        'view:separationLocation': {
          type: 'object',
          properties: {},
        },
        separationLocation: autosuggest.schema,
      },
    },
  },
};
