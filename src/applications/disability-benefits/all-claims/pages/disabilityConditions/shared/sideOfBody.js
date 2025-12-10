import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createNewConditionName } from './utils';

const sideOfBodyOptions = {
  RIGHT: 'Right',
  LEFT: 'Left',
  BILATERAL: 'Bilateral (both sides)',
};

/** @returns {PageSchema} */
const sideOfBodyPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => createNewConditionName(formData, true),
      undefined,
      false,
    ),
    sideOfBody: radioUI({
      title: 'Which side of the body is your condition on?',
      labels: sideOfBodyOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['sideOfBody'],
    properties: {
      sideOfBody: radioSchema(Object.keys(sideOfBodyOptions)),
    },
  },
};

export default sideOfBodyPage;
