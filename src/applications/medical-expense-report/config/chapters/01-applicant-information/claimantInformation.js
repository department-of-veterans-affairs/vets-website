import {
  titleUI,
  fullNameSchema,
  fullNameUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your name',
      'You aren’t required to fill in all fields, but we can review your application faster if you provide more information.',
    ),
    claimantFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    required: ['claimantFullName'],
    properties: {
      claimantFullName: fullNameSchema,
    },
  },
};
