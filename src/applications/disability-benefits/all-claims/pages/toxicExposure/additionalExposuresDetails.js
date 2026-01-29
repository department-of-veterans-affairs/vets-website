import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { currentOrPastDateUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  additionalExposuresPageTitle,
  dateRangeAdditionalInfo,
  detailsPageBegin,
  exposureEndDateApproximate,
  exposureStartDateApproximate,
  getKeyIndex,
  getSelectedCount,
  notSureHazardDetails,
  showCheckboxLoopDetailsPage,
  teSubtitle,
} from '../../content/toxicExposure';
import { ADDITIONAL_EXPOSURES, TE_URL_PREFIX } from '../../constants';
import { validateToxicExposureDates } from '../../utils/validations';

/**
 * Make the uiSchema for each additional exposures details page
 * @param {string} itemId - unique id for the exposure
 * @returns {object} uiSchema object
 */
function makeUiSchema(itemId) {
  return {
    'ui:title': ({ formData }) =>
      detailsPageBegin(
        additionalExposuresPageTitle,
        teSubtitle(
          getKeyIndex(itemId, 'otherExposures', formData),
          getSelectedCount('otherExposures', formData, 'specifyOtherExposures'),
          ADDITIONAL_EXPOSURES[itemId],
          'Hazard',
        ),
        'hazards',
      ),
    toxicExposure: {
      otherExposuresDetails: {
        [itemId]: {
          startDate: {
            ...currentOrPastDateUI({
              title: exposureStartDateApproximate,
            }),
          },
          endDate: {
            ...currentOrPastDateUI({
              title: exposureEndDateApproximate,
            }),
          },
          'ui:validations': [validateToxicExposureDates],
          'view:notSure': {
            'ui:title': notSureHazardDetails,
            'ui:webComponentField': VaCheckboxField,
            'ui:options': {
              classNames: 'vads-u-margin-y--3',
            },
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
                  startDate: full526EZSchema.definitions.minimumYearDate,
                  endDate: full526EZSchema.definitions.minimumYearDate,
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
