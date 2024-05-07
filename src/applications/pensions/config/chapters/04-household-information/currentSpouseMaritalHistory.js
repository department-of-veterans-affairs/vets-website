import {
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { isMarried } from './helpers';

const { currentSpouseMaritalHistory } = fullSchemaPensions.properties;

const radioOptions = {
  YES: 'Yes',
  NO: 'No',
  IDK: 'I’m not sure',
};

/** @type {PageSchema} */
export default {
  title: 'Current spouse marital history',
  path: 'household/marital-status/spouse-marital-history',
  depends: isMarried,
  uiSchema: {
    ...titleUI('Current spouse’s marital history'),
    currentSpouseMaritalHistory: radioUI({
      title: 'Has your spouse been married before?',
      labels: radioOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['currentSpouseMaritalHistory'],
    properties: {
      currentSpouseMaritalHistory,
    },
  },
};
