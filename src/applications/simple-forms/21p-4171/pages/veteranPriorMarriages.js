import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI("Veteran's other marriages"),
    veteran: {
      hadOtherMarriages: yesNoUI(
        'Had/has the Veteran ever entered into any other marriage(s)?',
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteran: {
        type: 'object',
        properties: {
          hadOtherMarriages: yesNoSchema,
        },
      },
    },
  },
};
