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
