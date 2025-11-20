import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('When did this occur'),
    referenceDate: currentOrPastDateUI('Date'),
  },
  schema: {
    type: 'object',
    properties: {
      referenceDate: currentOrPastDateSchema,
    },
    required: ['referenceDate'],
  },
  depends: formData => formData?.heardReferToEachOther === true,
};
