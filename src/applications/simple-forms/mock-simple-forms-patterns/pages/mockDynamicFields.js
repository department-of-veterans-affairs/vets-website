import {
  radioUI,
  radioSchema,
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        formData.dynamicConditional
          ? 'Dynamic fields'
          : 'Dynamic fields updated',
    ),
    dynamicConditional: yesNoUI({
      title: 'Show dynamic fields?',
      description: 'Unchanged description',
      updateUiSchema: formData => {
        return formData.dynamicConditional
          ? {
              'ui:title': 'Dynamic fields updated',
            }
          : {
              'ui:title': 'Dynamic fields?',
            };
      },
    }),
    dynamicText: {
      'ui:title': 'Update description and hint',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        updateUiSchema: formData => {
          return formData.dynamicConditional
            ? {
                'ui:description': 'Updated text field description',
                'ui:options': {
                  hint: 'Updated hint text',
                },
              }
            : {
                'ui:description': '',
                'ui:options': {
                  hint: 'Default hint text',
                },
              };
        },
      },
    },
    dynamicHiddenField: yesNoUI({
      title: 'Disappearing field',
      hideIf: formData => !formData.dynamicConditional,
    }),
    dynamicRequiredField: {
      ...radioUI({
        title: 'Required?',
        labels: {
          A: 'Option A',
          B: 'Option B',
        },
        updateUiSchema: formData => {
          return formData.dynamicConditional
            ? {
                'ui:options': {
                  labels: {
                    A: 'Option A',
                    B: 'Option B',
                    C: 'Option C',
                  },
                },
              }
            : {
                'ui:options': {
                  labels: {
                    A: 'Option A',
                    B: 'Option B',
                  },
                },
              };
        },
        updateSchema: formData => {
          return formData.dynamicConditional
            ? radioSchema(['A', 'B', 'C'])
            : radioSchema(['A', 'B']);
        },
      }),
      'ui:required': formData => formData.dynamicConditional,
    },
  },
  schema: {
    type: 'object',
    properties: {
      dynamicConditional: yesNoSchema,
      dynamicText: {
        type: 'string',
      },
      dynamicHiddenField: yesNoSchema,
      dynamicRequiredField: radioSchema(['A', 'B']),
    },
    required: [],
  },
};
