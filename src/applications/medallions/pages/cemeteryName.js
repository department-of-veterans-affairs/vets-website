import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Cemetery name'),
    cemeteryName: textUI({
      title: 'Enter the name of the cemetery',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      cemeteryName: {
        ...textSchema,
        maxLength: 60,
      },
    },
  },
};
