import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    // TODO: customize labels
    veteranHasFiledClaim: {
      ...yesNoUI('Has the Veteran ever filed a claim with VA?'),
      'ui:options': {
        labels: {
          Y: 'Yes, the Veteran has filed a VA claim before.',
          N: 'No, the Veteran has never filed a VA claim.',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranHasFiledClaim: yesNoSchema,
    },
  },
};
