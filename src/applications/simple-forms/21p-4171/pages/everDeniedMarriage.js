import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Marriage denial'),
    everDenied: yesNoUI(
      'Did/do either the Veteran or claimed spouse ever deny the marriage?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      everDenied: yesNoSchema,
    },
    required: ['everDenied'],
  },
};
