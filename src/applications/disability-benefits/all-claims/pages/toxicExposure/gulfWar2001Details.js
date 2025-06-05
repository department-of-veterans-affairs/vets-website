import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { currentOrPastDateUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  dateRangeAdditionalInfo,
  detailsPageBegin,
  endDateApproximate,
  getKeyIndex,
  getSelectedCount,
  gulfWar2001PageTitle,
  notSureDatesDetails,
  showCheckboxLoopDetailsPage,
  startDateApproximate,
  teSubtitle,
} from '../../content/toxicExposure';
import { GULF_WAR_2001_LOCATIONS, TE_URL_PREFIX } from '../../constants';
import { validateToxicExposureGulfWar2001Dates } from '../../utils/validations';

/**
 * Make the uiSchema for each gulf war 2001 details page
 * @param {string} locationId - unique id for the location
 * @returns {object} uiSchema object
 */
function makeUiSchema(locationId) {
  return {
    'ui:title': ({ formData }) =>
      detailsPageBegin(
        gulfWar2001PageTitle,
        teSubtitle(
          getKeyIndex(locationId, 'gulfWar2001', formData),
          getSelectedCount('gulfWar2001', formData),
          GULF_WAR_2001_LOCATIONS[locationId],
        ),
      ),
    toxicExposure: {
      gulfWar2001Details: {
        [locationId]: {
          startDate: {
            ...currentOrPastDateUI({
              title: startDateApproximate,
            }),
          },
          endDate: {
            ...currentOrPastDateUI({
              title: endDateApproximate,
            }),
          },
          'ui:validations': [validateToxicExposureGulfWar2001Dates],
          'view:notSure': {
            'ui:title': notSureDatesDetails,
            'ui:webComponentField': VaCheckboxField,
            'ui:options': {
              classNames: 'vads-u-margin-y--3',
            },
          },
        },
      },
      'view:gulfWar2001AdditionalInfo': {
        'ui:description': dateRangeAdditionalInfo,
      },
    },
  };
}

/**
 * Make the schema for each gulf war 2001 details page
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
          gulfWar2001Details: {
            type: 'object',
            properties: {
              [locationId]: {
                type: 'object',
                properties: {
                  startDate: full526EZSchema.definitions.minimumYearDate,
                  endDate: full526EZSchema.definitions.minimumYearDate,
                  'view:notSure': {
                    type: 'boolean',
                  },
                },
              },
            },
          },
          'view:gulfWar2001AdditionalInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  };
}

/**
 * Make all the page configurations for each Gulf War 2001 details pages. Example
 * {
 *  'gulf-war-2001-location-djibouti': {
 *    title: 'Service post-9/11',
 *    path: 'toxic-exposure/gulf-war-2001-location-djibouti',
 *    uiSchema: [Object],
 *    schema: [Object],
 *    depends: [Function: depends]
 *  },
 *  'gulf-war-2001-location-lebanon': {
 *    ... // continue for the rest of the locations
 *  }
 * }
 *
 * @returns an object with a page object for each details page
 */
export function makePages() {
  const gulfWar2001DetailPagesList = Object.keys(GULF_WAR_2001_LOCATIONS)
    .filter(locationId => locationId !== 'none' && locationId !== 'notsure')
    .map(locationId => {
      const pageName = `gulf-war-2001-location-${locationId}`;

      return {
        [pageName]: {
          title: formData =>
            teSubtitle(
              getKeyIndex(locationId, 'gulfWar2001', formData),
              getSelectedCount('gulfWar2001', formData),
              GULF_WAR_2001_LOCATIONS[locationId],
            ),
          path: `${TE_URL_PREFIX}/${pageName}`,
          uiSchema: makeUiSchema(locationId),
          schema: makeSchema(locationId),
          depends: formData =>
            showCheckboxLoopDetailsPage(formData, 'gulfWar2001', locationId),
        },
      };
    });

  return Object.assign({}, ...gulfWar2001DetailPagesList);
}
