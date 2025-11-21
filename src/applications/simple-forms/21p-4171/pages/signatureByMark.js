import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Signature by mark',
      'If you are unable to sign your name, you may use an "X" mark. Two witnesses will be required.',
    ),
    signatureByMark: yesNoUI('Are you signing this form with an "X" mark?'),
  },
  schema: {
    type: 'object',
    properties: {
      signatureByMark: yesNoSchema,
    },
    required: ['signatureByMark'],
  },
};
