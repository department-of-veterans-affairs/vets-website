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
    ...titleUI('When and where did you get married?'),
    marriageDate: currentOrPastDateUI({
      title: 'Date of marriage',
      monthSelect: false,
    }),
    placeOfMarriage: textUI({
      title: 'Place of marriage',
      hint: 'City, state or foreign country',
    }),
  },
  schema: {
    type: 'object',
    required: ['marriedAtDeath', 'marriageDate', 'placeOfMarriage'],
    properties: {
      marriageDate: currentOrPastDateSchema,
      placeOfMarriage: textSchema,
    },
  },
};
