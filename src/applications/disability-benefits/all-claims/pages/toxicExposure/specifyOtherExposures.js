import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  additionalExposuresPageTitle,
  dateRangeAdditionalInfo,
  dateRangePageDescription,
  exposureEndDateApproximate,
  exposureStartDateApproximate,
  getOtherFieldDescription,
  getSelectedCount,
  notSureDatesDetails,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(additionalExposuresPageTitle),
  'ui:description': ({ formData }) => {
    const indexAndSelectedCount = getSelectedCount(
      'otherExposures',
      formData,
      'specifyOtherExposures',
    );
    return dateRangePageDescription(
      indexAndSelectedCount,
      indexAndSelectedCount,
      getOtherFieldDescription(formData, 'specifyOtherExposures'),
      'Hazard',
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
