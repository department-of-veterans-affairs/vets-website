import {
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';
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
  teSubtitle,
} from '../../content/toxicExposure';

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
      startDate: currentOrPastMonthYearDateUI({
        title: exposureStartDateApproximate,
      }),
      endDate: currentOrPastMonthYearDateUI({
        title: exposureEndDateApproximate,
      }),
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
            startDate: currentOrPastMonthYearDateSchema,
            endDate: currentOrPastMonthYearDateSchema,
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
  },
};
