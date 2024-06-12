import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const typeOfRoleOptions = {
  ATTORNEY: 'I am an attorney',
  CLAIMS_AGENT: 'I am a claims agent',
};

/** @type {PageSchema} */
export default {
  title: 'Type of role',
  path: 'type-of-role',
  uiSchema: {
    typeOfRole: radioUI({
      title: 'Which type of role are you applying for?',
      labels: typeOfRoleOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      typeOfRole: radioSchema(Object.keys(typeOfRoleOptions)),
    },
    required: ['typeOfRole'],
  },
};
