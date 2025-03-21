import {
  textUI,
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
      yourOrgText: {
        type: 'string',
        maxLength: 60,
      },
    },
    required: ['yourOrgText'],
  },
};
