import { currentOrPastMonthYearDateUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  dateRangeAdditionalInfo,
  detailsPageBegin,
  endDateApproximate,
  getKeyIndex,
  getSelectedCount,
  gulfWar1990PageTitle,
  notSureDatesDetails,
  reviewDateField,
  showCheckboxLoopDetailsPage,
  startDateApproximate,
  teSubtitle,
} from '../../content/toxicExposure';
import { GULF_WAR_1990_LOCATIONS, TE_URL_PREFIX } from '../../constants';
import { validateToxicExposureGulfWar1990Dates } from '../../utils/validations';
import { validateApproximateMonthYearDate } from '../../utils/dates';
import {
  ForceFieldBlur,
  monthYearDateSchemaWithFullDateSupport,
} from './utils';

/**
 * Make the uiSchema for each gulf war 1990 details page
 * @param {string} locationId - unique id for the location
 * @returns {object} uiSchema object
 */
function makeUiSchema(locationId) {
  return {
    'ui:title': ({ formData }) =>
      detailsPageBegin(
        gulfWar1990PageTitle,
        teSubtitle(
          getKeyIndex(locationId, 'gulfWar1990', formData),
          getSelectedCount('gulfWar1990', formData),
          GULF_WAR_1990_LOCATIONS[locationId],
        ),
      ),
    toxicExposure: {
      gulfWar1990Details: {
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
          'ui:validations': [validateToxicExposureGulfWar1990Dates],
          'view:notSure': {
            'ui:title': notSureDatesDetails,
            'ui:webComponentField': VaCheckboxField,
            'ui:options': {
              classNames: 'vads-u-margin-y--3',
            },
          },
        },
      },
      'view:gulfWar1990AdditionalInfo': {
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
 * Make the schema for each gulf war 1990 details page
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
          gulfWar1990Details: {
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
          'view:gulfWar1990AdditionalInfo': {
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

/**
 * Make all the page configurations for each Gulf War 1990 details pages. Example
 * {
 *  'gulf-war-1990-location-afghanistan': {
 *    title: 'Service after August 2, 1990',
 *    path: 'toxic-exposure/gulf-war-1990-location-afghanistan',
 *    uiSchema: [Object],
 *    schema: [Object],
 *    depends: [Function: depends]
 *  },
 *  'gulf-war-1990-location-bahrain': {
 *    ... // continue for the rest of the 17 locations
 *  }
 * }
 *
 * @returns an object with a page object for each details page
 */
export function makePages() {
  const gulfWar1990DetailPagesList = Object.keys(GULF_WAR_1990_LOCATIONS)
    .filter(locationId => locationId !== 'none' && locationId !== 'notsure')
    .map(locationId => {
      const pageName = `gulf-war-1990-location-${locationId}`;
      return {
        [pageName]: {
          title: formData =>
            teSubtitle(
              getKeyIndex(locationId, 'gulfWar1990', formData),
              getSelectedCount('gulfWar1990', formData),
              GULF_WAR_1990_LOCATIONS[locationId],
            ),
          path: `${TE_URL_PREFIX}/${pageName}`,
          uiSchema: makeUiSchema(locationId),
          schema: makeSchema(locationId),
          depends: formData =>
            showCheckboxLoopDetailsPage(formData, 'gulfWar1990', locationId),
        },
      };
    });

  return Object.assign({}, ...gulfWar1990DetailPagesList);
}
