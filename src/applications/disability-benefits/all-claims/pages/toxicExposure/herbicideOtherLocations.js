import full526EZSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
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
import { validateToxicExposureDates } from '../../utils/validations';

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
            startDate: full526EZSchema.definitions.minimumYearDate,
            endDate: full526EZSchema.definitions.minimumYearDate,
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
