import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  dateRangeAdditionalInfo,
  detailsPageBegin,
  endDateApproximate,
  getOtherFieldDescription,
  getSelectedCount,
  herbicidePageTitle,
  notSureDatesDetails,
  startDateApproximate,
  teSubtitle,
} from '../../content/toxicExposure';

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
