import {
  selectSchema,
  selectUI,
  inlineTitleSchema,
  inlineTitleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

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
    'view:wcv3Title': inlineTitleUI('Web component v3'),
    wcv3SelectSimple: selectUI('Select simple'),
    wcv3SelectValues: selectUI({
      title: 'Select web component using labels literally as the value',
      errorMessages: {
        required: 'This is a custom error message.',
      },
    }),
    wcv3SelectKeyValues: selectUI({
      title: 'Select web component using key/value labels',
      hint: 'This is a hint',
      labels: {
        option1: 'Option 1',
        option2: 'Option 2',
      },
    }),
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
      'view:wcv3Title': inlineTitleSchema,
      wcv3SelectSimple: selectSchema(['Option 1', 'Option 2']),
      wcv3SelectValues: selectSchema(['Option 1', 'Option 2']),
      wcv3SelectKeyValues: selectSchema(['option1', 'option2']),
    },
    required: ['selectDefault', 'wcv3SelectSimple'],
  },
};
