import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  dateRangeAdditionalInfo,
  dateRangePageDescription,
  endDateApproximate,
  getOtherFieldDescription,
  getSelectedCount,
  herbicidePageTitle,
  notSureDatesDetails,
  startDateApproximate,
} from '../../content/toxicExposure';
import { formTitle } from '../../utils';

export const uiSchema = {
  'ui:title': formTitle(herbicidePageTitle),
  'ui:description': ({ formData }) => {
    const indexAndSelectedCount = getSelectedCount(
      'herbicide',
      formData,
      'otherHerbicideLocations',
    );
    return dateRangePageDescription(
      indexAndSelectedCount,
      indexAndSelectedCount,
      getOtherFieldDescription(formData, 'otherHerbicideLocations'),
    );
  },
  toxicExposure: {
    otherHerbicideLocations: {
      startDate: currentOrPastDateUI({
        title: startDateApproximate,
      }),
      endDate: currentOrPastDateUI({
        title: endDateApproximate,
      }),
      'view:notSure': {
        'ui:title': notSureDatesDetails,
      },
    },
    'view:herbicideAdditionalInfo': {
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
        otherHerbicideLocations: {
          type: 'object',
          properties: {
            startDate: currentOrPastDateSchema,
            endDate: currentOrPastDateSchema,
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
  },
};
