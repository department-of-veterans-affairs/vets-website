import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  selectUI,
  selectSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { serviceBranchLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

const { placeOfSeparation } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': generateTitle('Service period'),
    serviceBranch: selectUI({
      title: 'Branch of service',
      labels: serviceBranchLabels,
      errorMessages: {
        required: 'Please select your branch of service',
      },
    }),
    serviceDateRange: currentOrPastDateRangeUI(
      { title: 'Service start date', dataDogHidden: true },
      { title: 'Service end date', dataDogHidden: true },
    ),
    placeOfSeparation: {
      'ui:title': 'Place of separation',
      'ui:options': {
        hint: 'Enter the city and state or name of the military base',
      },
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    required: ['serviceBranch'],
    properties: {
      serviceBranch: selectSchema(Object.keys(serviceBranchLabels)),
      serviceDateRange: { ...currentOrPastDateRangeSchema, required: [] },
      placeOfSeparation,
    },
  },
};
