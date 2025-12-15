import {
  titleUI,
  yesNoUI,
  yesNoSchema,
  dateOfDeathUI,
  dateOfDeathSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Additional Veteran information'),
    vaClaimsHistory: yesNoUI({
      title:
        'Has the Veteran, surviving spouse, child, or parent ever filed a claim with the VA?',
    }),
    diedOnDuty: yesNoUI({
      title: 'Did the Veteran die while on active duty?',
    }),
    veteranDateOfDeath: dateOfDeathUI({
      monthSelect: false,
    }),
  },
  schema: {
    type: 'object',
    required: ['vaClaimsHistory', 'diedOnDuty', 'veteranDateOfDeath'],
    properties: {
      vaClaimsHistory: yesNoSchema,
      diedOnDuty: yesNoSchema,
      veteranDateOfDeath: dateOfDeathSchema,
    },
  },
};
