import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const roleOptions = {
  ATTORNEY: 'Attorney',
  CLAIMS_AGENT: 'Claims agent',
};

/** @type {PageSchema} */
export default {
  title: 'Role',
  path: 'role',
  uiSchema: {
    role: radioUI({
      title: 'What type of role are you applying for?',
      labels: roleOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      role: radioSchema(Object.keys(roleOptions)),
    },
    required: ['role'],
  },
};
