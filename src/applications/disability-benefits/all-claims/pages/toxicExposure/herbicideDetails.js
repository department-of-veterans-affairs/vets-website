import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { formTitle } from '../../utils';
import {
  dateRangeAdditionalInfo,
  dateRangePageDescription,
  endDateApproximate,
  getKeyIndex,
  getOtherFieldDescription,
  getSelectedCount,
  herbicidePageTitle,
  showCheckboxLoopDetailsPage,
  startDateApproximate,
  teSubtitle,
} from '../../content/toxicExposure';
import { HERBICIDE_LOCATIONS, TE_URL_PREFIX } from '../../constants';

/**
 * Make the uiSchema for each herbicide details page
 * @param {string} locationId - unique id for the location
 * @returns {object} uiSchema object
 */
function makeUiSchema(locationId) {
  return {
    'ui:title': formTitle(herbicidePageTitle),
    'ui:description': ({ formData }) =>
      dateRangePageDescription(
        getKeyIndex(locationId, 'herbicide', formData),
        getSelectedCount('herbicide', formData) +
          (getOtherFieldDescription(formData, 'otherHerbicideLocations')
            ? 1
            : 0),
        HERBICIDE_LOCATIONS[locationId],
      ),
    toxicExposure: {
      herbicideDetails: {
        [locationId]: {
          startDate: currentOrPastDateUI({
            title: startDateApproximate,
          }),
          endDate: currentOrPastDateUI({
            title: endDateApproximate,
          }),
        },
      },
      'view:herbicideAdditionalInfo': {
        'ui:description': dateRangeAdditionalInfo,
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
                  startDate: currentOrPastDateSchema,
                  endDate: currentOrPastDateSchema,
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
  };
}

export function makePages() {
  const herbicideLocationPagesList = Object.keys(HERBICIDE_LOCATIONS)
    .filter(locationId => locationId !== 'none')
    .map(locationId => {
      const pageName = `herbicide-location-${locationId}`;
      return {
        [pageName]: {
          title: formData =>
            teSubtitle(
              getKeyIndex(locationId, 'herbicide', formData),
              getSelectedCount('herbicide', formData) +
                (getOtherFieldDescription(formData, 'otherHerbicideLocations')
                  ? 1
                  : 0),
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
