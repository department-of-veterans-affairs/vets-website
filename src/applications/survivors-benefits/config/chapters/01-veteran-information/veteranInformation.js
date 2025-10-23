import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  serviceNumberUI,
  serviceNumberSchema,
  titleUI,
  yesNoUI,
  yesNoSchema,
  dateOfDeathUI,
  dateOfDeathSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const vetInfoNameDob = {
  uiSchema: {
    ...titleUI("Veteran's identification information"),
    veteranSocialSecurityNumber: ssnUI(),
    veteranVAFileNumber: vaFileNumberUI(),
    veteranServiceNumber: serviceNumberUI('Service number'),
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber', 'veteranServiceNumber'],
    properties: {
      veteranSocialSecurityNumber: ssnSchema,
      veteranVAFileNumber: vaFileNumberSchema,
      veteranServiceNumber: serviceNumberSchema,
    },
  },
};

/** @type {PageSchema} */
const vetInfoQuestions = {
  uiSchema: {
    ...titleUI('Veteran information'),
    vaClaimsHistory: yesNoUI({
      title:
        'Has the Veteran, surviving spouse, child or parent ever filed a claim with the VA?',
    }),
    diedOnDuty: yesNoUI({
      title: 'Did the Veteran die while on active duty?',
    }),
    veteranDateOfDeath: dateOfDeathUI({
      hint:
        'Enter 1 or 2 digits for the month and day and 4 digits for the year.',
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

export { vetInfoNameDob, vetInfoQuestions };
