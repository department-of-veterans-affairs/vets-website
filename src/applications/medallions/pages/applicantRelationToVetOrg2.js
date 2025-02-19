import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your organization'),
    yourOrgText: textUI({
      title:
        'Enter the name of the Veterans Service Organization (VSO) you represent',
    }),
  },

  schema: {
    type: 'object',
    properties: {
      yourOrgText: textSchema,
    },
    required: ['yourOrgText'],
  },
};
