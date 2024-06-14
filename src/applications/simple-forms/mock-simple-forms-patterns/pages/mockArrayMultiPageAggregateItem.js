import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ChildViewCard, ChildNameHeader } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    exampleArrayData: {
      'ui:options': {
        viewField: ChildViewCard,
      },
      items: {
        'ui:title': ChildNameHeader,
        address: addressUI({
          omit: ['isMilitary'],
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      exampleArrayData: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            address: addressSchema({
              omit: ['isMilitary'],
            }),
          },
        },
      },
    },
  },
};
