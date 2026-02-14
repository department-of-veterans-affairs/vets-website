import { currentOrPastMonthYearDateUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  additionalExposuresPageTitle,
  dateRangeAdditionalInfo,
  detailsPageBegin,
  exposureEndDateApproximate,
  exposureStartDateApproximate,
  getOtherFieldDescription,
  getSelectedCount,
  notSureHazardDetails,
  reviewDateField,
  teSubtitle,
} from '../../content/toxicExposure';
import { validateToxicExposureDates } from '../../utils/validations';
import { validateApproximateMonthYearDate } from '../../utils/dates';
import {
  ForceFieldBlur,
  makeDateConfirmationField,
  monthYearDateSchemaWithFullDateSupport,
} from './utils';

export const uiSchema = {
  'ui:title': ({ formData }) => {
    const indexAndSelectedCount = getSelectedCount(
      'otherExposures',
      formData,
      'specifyOtherExposures',
    );
    return detailsPageBegin(
      additionalExposuresPageTitle,
      teSubtitle(
        indexAndSelectedCount,
        indexAndSelectedCount,
        getOtherFieldDescription(formData, 'specifyOtherExposures'),
        'Hazard',
      ),
      'hazards',
    );
  },

  toxicExposure: {
    specifyOtherExposures: {
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
        'ui:confirmationField': makeDateConfirmationField(
          exposureStartDateApproximate,
        ),
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
        'ui:confirmationField': makeDateConfirmationField(
          exposureEndDateApproximate,
        ),
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
    'view:additionalExposuresAdditionalInfo': {
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

export const schema = {
  type: 'object',
  properties: {
    toxicExposure: {
      type: 'object',
      properties: {
        specifyOtherExposures: {
          type: 'object',
          properties: {
            startDate: monthYearDateSchemaWithFullDateSupport,
            endDate: monthYearDateSchemaWithFullDateSupport,
            'view:notSure': {
              type: 'boolean',
            },
          },
        },
        'view:additionalExposuresAdditionalInfo': {
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
