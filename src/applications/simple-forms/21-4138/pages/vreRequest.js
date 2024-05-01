import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import { VRE_REQUEST_HANDOFF } from '../config/constants';

/** @type {PageSchema} */
export const vreRequestHandoffPage = {
  uiSchema: {
    ...titleUI({
      title: "There's a better way to request Chapter 31 support",
      headerLevel: 1,
    }),
    'view:vreRequestHandoffContent': {
      'ui:description': VRE_REQUEST_HANDOFF,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:vreRequestHandoffContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};
