import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  inlineTitleSchema,
  inlineTitleUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI('RJSF'),
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
    wc: inlineTitleUI('Web component'),
    selectWC: {
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
    textWC: {
      'ui:title': 'title - text web component',
      'ui:webComponentField': VaTextInputField,
      'ui:description': 'description',
      'ui:hint': 'hint',
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
    },
    selectWC2: {
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
    wcv3: inlineTitleUI('Web component v3'),
    textWCV3: {
      'ui:title': 'title - text web component',
      'ui:webComponentField': VaTextInputField,
      'ui:description': 'description',
      'ui:hint': 'hint',
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
      'ui:options': {
        uswds: true,
      },
    },
    selectWC2V3: {
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
        uswds: true,
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
        uswds: true,
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
      rjsf: titleSchema,
      selectDefault: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      selectDisabled: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      wc: inlineTitleSchema,
      selectWC: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      textWC: {
        type: 'string',
      },
      selectWC2: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      wcv3: inlineTitleSchema,
      textWCV3: {
        type: 'string',
      },
      selectWC2V3: {
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
