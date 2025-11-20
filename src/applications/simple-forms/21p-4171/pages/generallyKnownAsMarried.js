import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Marriage recognition'),
    generallyKnownAsMarried: yesNoUI(
      'Were/are the Veteran and the claimed spouse generally known as married?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      generallyKnownAsMarried: yesNoSchema,
    },
    required: ['generallyKnownAsMarried'],
  },
};
