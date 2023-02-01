import { content, reviewField } from '../content/optIn';

export default {
  uiSchema: {
    'ui:description': content.description,
    socOptIn: {
      'ui:title': content.label,
      'ui:reviewField': reviewField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      socOptIn: {
        type: 'boolean',
      },
    },
  },
};
