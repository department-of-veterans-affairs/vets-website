import { currentOrPastMonthYearDateUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
import {
  dateRangeAdditionalInfo,
  detailsPageBegin,
  endDateApproximate,
  getOtherFieldDescription,
  getSelectedCount,
  herbicidePageTitle,
  notSureDatesDetails,
  reviewDateField,
  startDateApproximate,
  teSubtitle,
} from '../../content/toxicExposure';
import { validateToxicExposureDates } from '../../utils/validations';
import { validateApproximateMonthYearDate } from '../../utils/dates';
import {
  ForceFieldBlur,
  monthYearDateSchemaWithFullDateSupport,
} from './utils';

export const uiSchema = {
  'ui:title': ({ formData }) => {
    const indexAndSelectedCount = getSelectedCount(
      'herbicide',
      formData,
      'otherHerbicideLocations',
    );
    return detailsPageBegin(
      herbicidePageTitle,
      teSubtitle(
        indexAndSelectedCount,
        indexAndSelectedCount,
        getOtherFieldDescription(formData, 'otherHerbicideLocations'),
      ),
    );
  },
  toxicExposure: {
    otherHerbicideLocations: {
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

export const schema = {
  type: 'object',
  properties: {
    toxicExposure: {
      type: 'object',
      properties: {
        otherHerbicideLocations: {
          type: 'object',
          properties: {
            startDate: monthYearDateSchemaWithFullDateSupport,
            endDate: monthYearDateSchemaWithFullDateSupport,
            'view:notSure': {
              type: 'boolean',
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
