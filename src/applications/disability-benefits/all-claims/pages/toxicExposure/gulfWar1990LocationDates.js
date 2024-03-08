import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { formTitle } from '../../utils';
import {
  dateRangePageDescription,
  getKeyIndex,
  getSelectedCount,
  gulfWar1990LocationsAdditionalInfo,
  gulfWar1990PageTitle,
  showGulfWar1990LocationDatesPage,
} from '../../content/toxicExposure';
import { GULF_WAR_1990_LOCATIONS } from '../../constants';

/**
 * Make the uiSchema for each gulf war 1990 location with dates page
 * @param {string} locationId - unique id for the location
 * @returns {object} uiSchema object
 */
export function makeUiSchema(locationId) {
  return {
    'ui:title': formTitle(gulfWar1990PageTitle),
    'ui:description': formData =>
      dateRangePageDescription(
        getKeyIndex(locationId, 'gulfWar1990', formData),
        getSelectedCount('gulfWar1990', formData),
        GULF_WAR_1990_LOCATIONS[locationId],
      ),
    gulfWar1990Locations: {
      [locationId]: {
        startDate: {
          ...currentOrPastDateUI('Service start date (approximate)'),
          'ui:options': {
            // monthYear: true,
          },
        },
        endDate: {
          ...currentOrPastDateUI('Service end date (approximate)'),
          'ui:options': {
            // monthYear: true,
          },
        },
      },
    },
    'view:gulfWar1990AdditionalInfo': {
      'ui:description': gulfWar1990LocationsAdditionalInfo,
    },
  };
}

/**
 * Make the schema for each gulf war 1990 location with dates page
 * @param {string} locationId - unique id for the location
 * @returns {object} - schema object
 */
export function makeSchema(locationId) {
  return {
    type: 'object',
    properties: {
      gulfWar1990Locations: {
        type: 'object',
        properties: {
          [locationId]: {
            type: 'object',
            properties: {
              startDate: {
                type: 'string',
                format: 'date',
              },
              endDate: {
                type: 'string',
                format: 'date',
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
  };
}

/**
 * Make all the page configurations for each Gulf War 1990 location + dates page
 *
 * @returns an object with a page object for each location + dates page
 */
export function makePages() {
  const gulfWar1990LocationPagesList = Object.keys(GULF_WAR_1990_LOCATIONS).map(
    locationId => {
      const pageName = `gulfWar1990Locations-${locationId}`;
      return {
        [pageName]: {
          title: gulfWar1990PageTitle,
          path: `gulfWar1990Locations-${locationId}`,
          uiSchema: makeUiSchema(locationId),
          schema: makeSchema(locationId),
          depends: formData =>
            showGulfWar1990LocationDatesPage(formData, locationId),
        },
      };
    },
  );

  return Object.assign({}, ...gulfWar1990LocationPagesList);
}
