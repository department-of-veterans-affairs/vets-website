import {
  titleSchema,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    rjsf: titleUI('', 'Has the Veteran ever filed a VA claim?'),
    // TODO: customize labels
    veteranHasFiledClaim: yesNoUI(),
  },
  schema: {
    type: 'object',
    properties: {
      rjsf: titleSchema,
      veteranHasFiledClaim: yesNoSchema,
    },
    required: ['veteranHasFiledClaim'],
  },
};
