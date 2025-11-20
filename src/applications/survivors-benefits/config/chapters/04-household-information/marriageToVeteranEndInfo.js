import {
  textUI,
  textSchema,
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('When and where did your marriage end?'),
    marriageEndDate: currentOrPastDateUI({
      title: 'Date marriage ended',
      monthSelect: false,
    }),

    placeMarriageEnded: textUI({
      title: 'Place marriage ended',
      hint: 'City, state or foreign country',
    }),
  },
  schema: {
    type: 'object',
    required: ['marriageEndDate', 'placeMarriageEnded'],
    properties: {
      marriageEndDate: currentOrPastDateSchema,
      placeMarriageEnded: textSchema,
    },
  },
};
