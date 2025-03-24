import {
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your organization'),
    yourOrganizationText: textUI({
      title: 'Enter the name of the cemetery or funeral home you represent',
    }),
  },

  schema: {
    type: 'object',
    properties: {
      yourOrganizationText: {
        type: 'string',
        maxLength: 60,
      },
    },
    required: ['yourOrgText'],
  },
};
