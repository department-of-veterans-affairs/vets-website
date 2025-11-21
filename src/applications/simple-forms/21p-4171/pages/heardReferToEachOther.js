import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Heard refer to each other'),
    heardReferToEachOther: yesNoUI(
      'Had/have you ever heard the Veteran or the claimed spouse refer to each other as married to one another?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      heardReferToEachOther: yesNoSchema,
    },
    required: ['heardReferToEachOther'],
  },
};
