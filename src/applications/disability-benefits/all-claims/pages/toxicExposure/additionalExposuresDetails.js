import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { formTitle } from '../../utils';
import {
  additionalExposuresPageTitle,
  dateRangeAdditionalInfo,
  dateRangePageDescription,
  exposureEndDateApproximate,
  exposureStartDateApproximate,
  getKeyIndex,
  getSelectedCount,
  notSureHazardDetails,
  showCheckboxLoopDetailsPage,
  teSubtitle,
} from '../../content/toxicExposure';
import { ADDITIONAL_EXPOSURES, TE_URL_PREFIX } from '../../constants';

/**
 * Make the uiSchema for each additional exposures details page
 * @param {string} itemId - unique id for the exposure
 * @returns {object} uiSchema object
 */
function makeUiSchema(itemId) {
  return {
    'ui:title': formTitle(additionalExposuresPageTitle),
    'ui:description': ({ formData }) =>
      dateRangePageDescription(
        getKeyIndex(itemId, 'otherExposures', formData),
        getSelectedCount('otherExposures', formData, 'specifyOtherExposures'),
        ADDITIONAL_EXPOSURES[itemId],
        'Hazard',
      ),
    toxicExposure: {
      otherExposuresDetails: {
        [itemId]: {
          startDate: currentOrPastDateUI({
            title: exposureStartDateApproximate,
          }),
          endDate: currentOrPastDateUI({
            title: exposureEndDateApproximate,
          }),
          'view:notSure': {
            'ui:title': notSureHazardDetails,
          },
        },
      },
      'view:otherExposuresAdditionalInfo': {
        'ui:description': dateRangeAdditionalInfo,
      },
    },
  };
}

/**
 * Make the schema for each additional exposures details page
 * @param {string} itemId - unique id for the exposure
 * @returns {object} - schema object
 */
function makeSchema(itemId) {
  return {
    type: 'object',
    properties: {
      toxicExposure: {
        type: 'object',
        properties: {
          otherExposuresDetails: {
            type: 'object',
            properties: {
              [itemId]: {
                type: 'object',
                properties: {
                  startDate: currentOrPastDateSchema,
                  endDate: currentOrPastDateSchema,
                  'view:notSure': {
                    type: 'boolean',
                  },
                },
              },
            },
          },
          'view:otherExposuresAdditionalInfo': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  };
}

export function makePages() {
  const pagesList = Object.keys(ADDITIONAL_EXPOSURES)
    .filter(itemId => itemId !== 'none' && itemId !== 'notsure')
    .map(itemId => {
      const pageName = `additional-exposure-${itemId}`;
      return {
        [pageName]: {
          title: formData =>
            teSubtitle(
              getKeyIndex(itemId, 'otherExposures', formData),
              getSelectedCount(
                'otherExposures',
                formData,
                'specifyOtherExposures',
              ),
              ADDITIONAL_EXPOSURES[itemId],
              'Hazard',
            ),
          path: `${TE_URL_PREFIX}/${pageName}`,
          uiSchema: makeUiSchema(itemId),
          schema: makeSchema(itemId),
          depends: formData =>
            showCheckboxLoopDetailsPage(formData, 'otherExposures', itemId),
        },
      };
    });

  return Object.assign({}, ...pagesList);
}
