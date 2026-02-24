// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('School closures and program suspension'),
    schoolWasClosed: yesNoUI({
      title:
        'Did your school close or suspend your individual program, or was your program withdrawn',
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
      schoolWasClosed: yesNoSchema,
    },
    required: ['schoolWasClosed'],
  },
};
