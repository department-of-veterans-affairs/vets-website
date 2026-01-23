import { currentOrPastMonthYearDateUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  dateRangeAdditionalInfo,
  detailsPageBegin,
  endDateApproximate,
  getKeyIndex,
  getSelectedCount,
  herbicidePageTitle,
  notSureDatesDetails,
  reviewDateField,
  showCheckboxLoopDetailsPage,
  startDateApproximate,
  teSubtitle,
} from '../../content/toxicExposure';
import { HERBICIDE_LOCATIONS, TE_URL_PREFIX } from '../../constants';
import { validateToxicExposureDates } from '../../utils/validations';
import { validateApproximateMonthYearDate } from '../../utils/dates';
import {
  ForceFieldBlur,
  monthYearDateSchemaWithFullDateSupport,
} from './utils';

/**
 * Make the uiSchema for each herbicide details page
 * @param {string} locationId - unique id for the location
 * @returns {object} uiSchema object
 */
function makeUiSchema(locationId) {
  return {
    'ui:title': ({ formData }) =>
      detailsPageBegin(
        herbicidePageTitle,
        teSubtitle(
          getKeyIndex(locationId, 'herbicide', formData),
          getSelectedCount('herbicide', formData, 'otherHerbicideLocations'),
          HERBICIDE_LOCATIONS[locationId],
        ),
      ),
    toxicExposure: {
      herbicideDetails: {
        [locationId]: {
          startDate: {
            ...currentOrPastMonthYearDateUI({
              title: startDateApproximate,
            }),
            'ui:required': false,
            // Replace platform validation (validateCurrentOrPastMonthYear) with custom validation
            'ui:validations': [validateApproximateMonthYearDate],
            'ui:errorMessages': {
              pattern: 'Please enter a valid date',
              required: 'Please enter a date',
            },
            'ui:reviewField': reviewDateField,
          },
          endDate: {
            ...currentOrPastMonthYearDateUI({
              title: endDateApproximate,
            }),
            'ui:required': false,
            // Replace platform validation (validateCurrentOrPastMonthYear) with custom validation
            'ui:validations': [validateApproximateMonthYearDate],
            'ui:errorMessages': {
              pattern: 'Please enter a valid date',
              required: 'Please enter a date',
            },
            'ui:reviewField': reviewDateField,
          },
          'ui:validations': [validateToxicExposureDates],
          'view:notSure': {
            'ui:title': notSureDatesDetails,
            'ui:webComponentField': VaCheckboxField,
            'ui:options': {
              classNames: 'vads-u-margin-y--3',
            },
          },
        },
      },
      'view:herbicideAdditionalInfo': {
        'ui:description': dateRangeAdditionalInfo,
      },
    },
    _forceFieldBlur: {
      'ui:field': ForceFieldBlur,
      'ui:options': {
        hideOnReview: true,
      },
    },
  };
}

/**
 * Make the schema for each herbicide details page
 * @param {string} locationId - unique id for the location
 * @returns {object} - schema object
 */
function makeSchema(locationId) {
  return {
    type: 'object',
    properties: {
      toxicExposure: {
        type: 'object',
        properties: {
          herbicideDetails: {
            type: 'object',
            properties: {
              [locationId]: {
                type: 'object',
                properties: {
                  startDate: monthYearDateSchemaWithFullDateSupport,
                  endDate: monthYearDateSchemaWithFullDateSupport,
                  'view:notSure': {
                    type: 'boolean',
                  },
                },
              },
            },
          },
          'view:herbicideAdditionalInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
      _forceFieldBlur: {
        type: 'boolean',
      },
    },
  };
}

export function makePages() {
  const herbicideLocationPagesList = Object.keys(HERBICIDE_LOCATIONS)
    .filter(locationId => locationId !== 'none' && locationId !== 'notsure')
    .map(locationId => {
      const pageName = `herbicide-location-${locationId}`;
      return {
        [pageName]: {
          title: formData =>
            teSubtitle(
              getKeyIndex(locationId, 'herbicide', formData),
              getSelectedCount(
                'herbicide',
                formData,
                'otherHerbicideLocations',
              ),
              HERBICIDE_LOCATIONS[locationId],
            ),
          path: `${TE_URL_PREFIX}/${pageName}`,
          uiSchema: makeUiSchema(locationId),
          schema: makeSchema(locationId),
          depends: formData =>
            showCheckboxLoopDetailsPage(formData, 'herbicide', locationId),
        },
      };
    });

  return Object.assign({}, ...herbicideLocationPagesList);
}
