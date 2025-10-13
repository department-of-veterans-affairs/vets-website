import {
  titleUI,
  yesNoUI,
  yesNoSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Veteran information',
  path: 'veteran/information',
  uiSchema: {
    ...titleUI('Veteran information'),
    vaClaimsHistory: yesNoUI({
      title:
        'Has the Veteran, surviving spouse, child or parent ever filed a claim with the VA?',
    }),
    diedOnDuty: yesNoUI({
      title: 'Did the Veteran die while on active duty?',
    }),
    vaFileNumber: {
      ...vaFileNumberUI(),
      'ui:options': {
        expandUnder: 'vaClaimsHistory',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['vaClaimsHistory', 'diedOnDuty'],
    properties: {
      vaClaimsHistory: yesNoSchema,
      diedOnDuty: yesNoSchema,
      vaFileNumber: vaFileNumberSchema,
    },
  },
};
