import {
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Your veteran information'),
    vaFileNumber: {
      ...textUI({
        title: 'Your VA file number',
        errorMessages: { required: 'Enter your VA file number' },
      }),
      'ui:options': { useV3: true },
    },
    militaryServiceNumber: {
      ...textUI({
        title: 'Your military service number',
      }),
      'ui:options': { useV3: true },
    },
  },
  schema: {
    type: 'object',
    required: ['vaFileNumber'],
    properties: {
      vaFileNumber: textSchema,
      militaryServiceNumber: textSchema,
    },
  },
};
