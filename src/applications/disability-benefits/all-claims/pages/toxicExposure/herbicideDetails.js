import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { formTitle } from '../../utils';
import {
  dateRangePageDescription,
  endDateApproximate,
  getKeyIndex,
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
    'ui:description': ({ formData }) => {
      return dateRangePageDescription(
        getKeyIndex(locationId, 'herbicide', formData),
        getSelectedCount('herbicide', formData) +
          (formData.toxicExposure?.otherHerbicideLocation ? 1 : 0),
        HERBICIDE_LOCATIONS[locationId],
      );
    },
    herbicideDetails: {
      [locationId]: {
        startDate: currentOrPastDateUI({
          title: startDateApproximate,
          monthYearOnly: true,
        }),
        endDate: currentOrPastDateUI({
          title: endDateApproximate,
          monthYearOnly: true,
        }),
      },
    },
    'view:herbicideAdditionalInfo': {
      'ui:description': 'additional info',
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
      'view:herbicideAdditionalInfo': {
        type: 'object',
        properties: {},
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
                (formData.toxicExposure?.otherHerbicideLocation ? 1 : 0),
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
