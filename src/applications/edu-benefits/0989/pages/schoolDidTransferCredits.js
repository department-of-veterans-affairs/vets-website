// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Transfer credits from NCD schools'),
    schoolDidTransferCredits: yesNoUI({
      title:
        'If you attended a NCD school that was closed, suspended your program, or was disapproved, did that school transfer any hours or credits?',
      hint:
        'A non-college degree school are education or training programs that do not lead to a traditional college degree.',
      errorMessages: {
        required: 'You must make a selection',
      },
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      schoolDidTransferCredits: yesNoSchema,
    },
    required: ['schoolDidTransferCredits'],
  },
};
