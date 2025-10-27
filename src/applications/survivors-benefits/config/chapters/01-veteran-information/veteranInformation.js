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
const vetIdentification = {
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
const vetIdentificationAdditional = {
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

export { vetIdentification, vetIdentificationAdditional };
