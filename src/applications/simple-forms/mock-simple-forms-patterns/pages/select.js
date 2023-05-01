import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    selectDefault: {
      'ui:title': 'Select default',
      'ui:description': 'This is a select widget with a default value.',
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
    selectWC: {
      'ui:title': 'Select web component',
      'ui:webComponentField': VaSelectField,
      'ui:description': 'This is a select widget with a default value.',
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
    selectDisabled: {
      'ui:title': 'Select web component - disabled',
      'ui:webComponentField': VaSelectField,
      'ui:description': 'This is a select widget with a default value.',
      'ui:disabled': 'true',
      'ui:options': {
        disabled: true,
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
      selectDefault: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      selectWC: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
      selectDisabled: {
        type: 'string',
        enum: ['option1', 'option2'],
      },
    },
  },
};
