import { currentOrPastMonthYearDateUI } from 'platform/forms-system/src/js/web-component-patterns';
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
  reviewDateField,
  showCheckboxLoopDetailsPage,
  teSubtitle,
} from '../../content/toxicExposure';
import { ADDITIONAL_EXPOSURES, TE_URL_PREFIX } from '../../constants';
import { validateToxicExposureDates } from '../../utils/validations';
import { validateApproximateMonthYearDate } from '../../utils/dates';
import {
  ForceFieldBlur,
  monthYearDateSchemaWithFullDateSupport,
} from './utils';

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
            ...currentOrPastMonthYearDateUI({
              title: exposureStartDateApproximate,
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
              title: exposureEndDateApproximate,
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
    _forceFieldBlur: {
      'ui:field': ForceFieldBlur,
      'ui:options': {
        hideOnReview: true,
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
                  startDate: monthYearDateSchemaWithFullDateSupport,
                  endDate: monthYearDateSchemaWithFullDateSupport,
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
      _forceFieldBlur: {
        type: 'boolean',
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
