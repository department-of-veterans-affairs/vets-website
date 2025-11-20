import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI("Spouse's other marriages"),
    spouse: {
      hadOtherMarriages: yesNoUI(
        'Has the claimed spouse ever entered into any other marriage(s)?',
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      spouse: {
        type: 'object',
        properties: {
          hadOtherMarriages: yesNoSchema,
        },
      },
    },
  },
};
