import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  additionalExposuresPageTitle,
  dateRangeAdditionalInfo,
  detailsPageBegin,
  exposureEndDateApproximate,
  exposureStartDateApproximate,
  getOtherFieldDescription,
  getSelectedCount,
  notSureDatesDetails,
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
      startDate: currentOrPastDateUI({
        title: exposureStartDateApproximate,
      }),
      endDate: currentOrPastDateUI({
        title: exposureEndDateApproximate,
      }),
      'view:notSure': {
        'ui:title': notSureDatesDetails,
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
            startDate: currentOrPastDateSchema,
            endDate: currentOrPastDateSchema,
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
