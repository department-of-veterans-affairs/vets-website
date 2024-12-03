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
      ({ formData }) =>
        `Side of the body for ${formData?.condition || 'condition'}`,
    ),
    sideOfBody: radioUI({
      title: 'Which side of the body is your condition on?',
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
