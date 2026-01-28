import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { requiresSpouseInfo } from './helpers';
import { showMultiplePageResponse } from '../../../helpers';

const radioOptions = {
  YES: 'Yes',
  NO: 'No',
  IDK: 'I’m not sure',
};

/** @type {PageSchema} */
export default {
  title: 'Current spouse marital history',
  path: 'household/marital-status/spouse-marital-history',
  depends: formData =>
    !showMultiplePageResponse() && requiresSpouseInfo(formData),
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
      currentSpouseMaritalHistory: radioSchema(Object.keys(radioOptions)),
    },
  },
};
