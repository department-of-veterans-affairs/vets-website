import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    selectDefault: {
      'ui:title': 'title - select rjsf',
      'ui:description': 'description',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
      'ui:options': {
        classNames: 'vads-u-background-color--gray-light-alt',
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
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'This is a custom error message.',
      },
      'ui:disabled': 'true',
      'ui:options': {
        classNames: 'vads-u-background-color--gray-light-alt',
        disabled: true,
        uswds: true,
        labels: {
          option1: 'Option 1',
          option2: 'Option 2',
        },
      },
    },
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
        classNames: 'vads-u-background-color--primary-alt-lightest',
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
      'ui:options': {
        classNames: 'vads-u-background-color--primary-alt-lightest',
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
        classNames: 'vads-u-background-color--primary-alt-lightest',
        disabled: true,
        uswds: false,
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
        classNames: 'vads-u-background-color--primary-alt-lightest',
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
      selectWC: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      textWC: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      selectWC2: {
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
