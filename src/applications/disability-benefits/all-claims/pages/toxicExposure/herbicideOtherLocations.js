import { currentOrPastDateUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';
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
import { toxicExposureDate } from '../../constants';

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
            startDate: toxicExposureDate,
            endDate: toxicExposureDate,
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
