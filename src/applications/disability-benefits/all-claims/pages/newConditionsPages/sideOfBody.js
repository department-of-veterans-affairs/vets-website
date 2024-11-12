import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const sideOfBodyOptions = {
  RIGHT: 'Right',
  LEFT: 'Left',
  BILATERAL: 'Bilateral (both sides)',
};

/** @returns {PageSchema} */
const sideOfBodyPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `Where is your ${formData.condition || 'condition'}?`,
    ),
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
