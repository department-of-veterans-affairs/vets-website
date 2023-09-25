import {
  fullNameSchema,
  fullNameUI,
  titleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ChildViewCard } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleUI('Child Information'),
    exampleArrayData: {
      'ui:options': {
        itemName: 'Child',
        viewField: ChildViewCard,
        keepInPageOnReview: true,
        customTitle: ' ',
        useDlWrap: true,
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        fullName: fullNameUI(),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': titleSchema,
      exampleArrayData: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            fullName: fullNameSchema,
          },
        },
      },
    },
  },
};
