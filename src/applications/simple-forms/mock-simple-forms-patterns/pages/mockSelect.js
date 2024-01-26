import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  inlineTitleSchema,
  inlineTitleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF'),
    selectDefault: {
      'ui:title': 'title - select rjsf',
      'ui:description': 'description',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
      'ui:options': {
        disabled: true,
        uswds: true,
        labels: {
          option1: 'Option 1',
          option2: 'Option 2',
        },
      },
    },
    selectDisabled: {
      'ui:title': 'title - select rjsf',
      'ui:description': 'description',
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
      'ui:disabled': 'true',
      'ui:options': {
        disabled: true,
        uswds: true,
        labels: {
          option1: 'Option 1',
          option2: 'Option 2',
        },
      },
    },
    'view:wcTitle': inlineTitleUI('Web component'),
    wcOldSelectFirst: {
      'ui:title': 'title - select web component',
      'ui:webComponentField': VaSelectField,
      'ui:description': 'description',
      'ui:hint': 'hint',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
      'ui:disabled': 'true',
      'ui:options': {
        disabled: true,
        uswds: false,
        labels: {
          option1: 'Option 1',
          option2: 'Option 2',
        },
      },
    },
    wcOldText: {
      'ui:title': 'title - text web component',
      'ui:webComponentField': VaTextInputField,
      'ui:description': 'description',
      'ui:hint': 'hint',
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
    },
    wcOldSelectSecond: {
      'ui:title': 'title - select web component 2',
      'ui:webComponentField': VaSelectField,
      'ui:description': 'description',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
      'ui:disabled': 'true',
      'ui:options': {
        disabled: true,
        uswds: false,
        labels: {
          option1: 'Option 1',
          option2: 'Option 2',
        },
      },
    },
    'view:wcv3Title': inlineTitleUI('Web component v3'),
    wcv3Text: {
      'ui:title': 'title - text web component',
      'ui:webComponentField': VaTextInputField,
      'ui:description': 'description',
      'ui:hint': 'hint',
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
    },
    wcv3Select: {
      'ui:title': 'title - select web component 2',
      'ui:webComponentField': VaSelectField,
      'ui:description': 'description',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
      'ui:disabled': 'true',
      'ui:options': {
        disabled: true,
        labels: {
          option1: 'Option 1',
          option2: 'Option 2',
        },
      },
    },
    selectWCDisabled: {
      'ui:title': 'title - select web component USWDS',
      'ui:webComponentField': VaSelectField,
      'ui:description': 'description',
      'ui:disabled': 'true',
      'ui:options': {
        hint: 'This is a hint',
        labels: {
          option1: 'Option 1',
          option2: 'Option 2',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      selectDefault: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      selectDisabled: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      'view:wcTitle': inlineTitleSchema,
      wcOldSelectFirst: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      wcOldText: {
        type: 'string',
      },
      wcOldSelectSecond: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      'view:wcv3Title': inlineTitleSchema,
      wcv3Text: {
        type: 'string',
      },
      wcv3Select: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      selectWCDisabled: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
    },
    required: [],
  },
};
