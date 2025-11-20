import {
  fullNameSchema,
  fullNameUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Claimed spouse’s name'),
    claimedSpouseFullName: fullNameUI(),
  },
  schema: {
    type: 'object',
    properties: {
      claimedSpouseFullName: fullNameSchema,
    },
    required: ['claimedSpouseFullName'],
  },
};
