import { radioSchema } from 'platform/forms-system/src/js/web-component-patterns';

export const dependents = {
  schema: {
    type: 'object',
    properties: {
      dependents: {
        type: 'array',
        items: {
          type: 'object',
          properties: {},
        },
      },
      hasDependentsStatusChanged: radioSchema(['Y', 'N']),
    },
  },
  uiSchema: {
    dependents: {},
    hasDependentsStatusChanged: {},
  },
};
