import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createTitle } from './utils';

const sideOfBodyOptions = {
  RIGHT: 'Right',
  LEFT: 'Left',
  BILATERAL: 'Bilateral (both sides)',
};

/** @returns {PageSchema} */
const sideOfBodyPage = {
  uiSchema: {
    ...titleUI(({ formData }) => {
      const condition = formData.condition || 'condition';

      return createTitle(
        `Where is your ${condition}?`,
        `Edit side of body for ${condition}`,
      );
    }),
    sideOfBody: radioUI({
      title: 'Side of body',
      labels: sideOfBodyOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      sideOfBody: radioSchema(Object.keys(sideOfBodyOptions)),
    },
  },
};

export default sideOfBodyPage;
