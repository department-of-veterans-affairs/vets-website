import { AuthorizationDescription } from '../content/Authorization';

export default {
  uiSchema: {
    'ui:title': AuthorizationDescription,
    'ui:options': {
      forceDivWrapper: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
